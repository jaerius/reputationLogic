const Graph = require('graphology');
const { readFileSync, writeFileSync } = require('fs');
const pagerank = require('graphology-metrics/centrality/pagerank');
const { degreeCentrality } = require('graphology-metrics/centrality/degree');
const closenessCentrality = require('graphology-metrics/centrality/closeness');
const betweennessCentrality = require('graphology-metrics/centrality/betweenness');
const louvain = require('graphology-communities-louvain');

// fromJSON 함수를 정의하여 그래프 데이터를 JSON에서 불러오는 기능 구현
const fromJSON = (GraphConstructor, json) => {
    const graph = new GraphConstructor();
    json.nodes.forEach(node => graph.addNode(node.key, node.attributes));
    json.edges.forEach(edge => graph.addEdge(edge.source, edge.target, edge.attributes));
    return graph;
  };
  
  // toJSON 함수를 정의하여 그래프 데이터를 JSON으로 변환하는 기능 구현
  const toJSON = (graph) => {
    return {
      nodes: graph.nodes().map(node => ({ key: node, attributes: graph.getNodeAttributes(node) })),
      edges: graph.edges().map(edge => ({
        source: graph.source(edge),
        target: graph.target(edge),
        attributes: graph.getEdgeAttributes(edge)
      }))
    };
  };
  
  // 평판 데이터를 생성하고 그래프를 구성하는 함수
  const generateGraphData = () => {
    const graph = new Graph();
    const users = Array.from({ length: 100 }, (_, i) => `User${i + 1}`);
    users.forEach(user => graph.addNode(user));
  
    // 악의적인 노드와 가짜 지갑 생성
    const maliciousNodes = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6'];
    const fakeWallets = Array.from({ length: 20 }, (_, i) => `Fake${i + 1}`);
  
    // 악의적인 노드 평가 로직
    maliciousNodes.forEach(source => { // maliciousNodes 배열의 각 요소에 대해 source로 설정
      maliciousNodes.forEach(target => { // user가 다른 malicious 유저에게 평가를 내리는 경우
        if (source !== target) {
          graph.addEdge(source, target, { weight: 100 });
        }
      });
      fakeWallets.forEach(fake => { // fakewallet이 malicious 유저에게 평가를 내리는 경우
        if (!graph.hasNode(fake)) {
          graph.addNode(fake);
        }
        graph.addEdge(fake, source, { weight: 100 });
      });
      users.filter(user => !maliciousNodes.includes(user)).forEach(target => { // malicious 유저가 아닌 다른 유저들에게 평가를 내리는 경우
        graph.addEdge(source, target, { weight: 10 }); // malicious 유저가 다른 non malicious 유저에게 10점 부여
      });
    });
  
    // 다른 사용자들의 평가 로직
    users.filter(user => !maliciousNodes.includes(user)).forEach(source => { // malicious 유저가 아닌 다른 유저들, maliciousNodes.includes(user)가 false인 경우
      users.forEach(target => { // forEach 메소드: 배열의 각 요소에 대해 주어진 함수를 실행
        if (source !== target && !graph.hasEdge(source, target)) {
          graph.addEdge(source, target, { weight: Math.floor(Math.random() * 80) + 1 }); // 1부터 100 중에 랜덤으로 값 생성
        }
      });
    });
  
    return graph;
  };
  
  // 그래프 데이터를 생성하고 JSON으로 저장
  const graph = generateGraphData();
  const graphDataJSON = toJSON(graph);
  writeFileSync('reputationGraph.json', JSON.stringify(graphDataJSON, null, 2));
  
  // 그래프 로드
  const loadedGraphData = JSON.parse(readFileSync('reputationGraph.json', 'utf8'));
  const loadedGraph = fromJSON(Graph, loadedGraphData);

  // weight를 제대로 사용하기 위하여 weight가 클 수록, 거리가 가까운 invertedWeightGraph생성
  const invertedWeightGraph = new Graph();
 
  // 원래 그래프에서 노드를 복사
  loadedGraph.forEachNode((node, attributes) => {
    invertedWeightGraph.addNode(node, attributes);
  });

  // 원래 그래프에서 엣지를 복사하면서 가중치를 변환
  loadedGraph.forEachEdge((edge, attributes, source, target) => {
    const invertedWeight = 1 / attributes.weight;
    invertedWeightGraph.addEdgeWithKey(edge, source, target, { ...attributes, weight: invertedWeight });
  
  });

  
  // Louvain 커뮤니티 탐지
  const louvainCommunities = louvain(loadedGraph);
  console.log('Louvain Communities:', louvainCommunities);
  
  // PageRank 계산
  const ranks = pagerank(loadedGraph, {
    attributes: {
        weight: 'weight'
    }
  });
  console.log('PageRank:', ranks);
  
  // Degree Centrality 계산 -> 단순히 노드에 연결된 엣지의 수만 카운트
  const degrees = degreeCentrality(loadedGraph, {
    attributes: {
        weight: 'weight'
    }
  });
  console.log('Degree Centrality:', degrees);
  
  // Closeness Centrality 계산
  const closeness = closenessCentrality(loadedGraph);
  console.log('Closeness Centrality:', closeness);

  // 그래프 상의 노드별 평가받은 weight점수 출력
  loadedGraph.forEachNode((node, attributes) => {
        let sumWeight = 0;
        loadedGraph.forEachEdge(node, (edge, edgeAttributes, source, target) => {
            if(target === node){
                sumWeight += edgeAttributes.weight || 0
            }
        })
        console.log(`Node ${node} sumWeight`, sumWeight)
  });
  
  // Betweenness Centrality 계산
  // 변환된 가중치를 사용하여 Betweenness Centrality 계산
  const betweenness = betweennessCentrality(invertedWeightGraph, {
    attributes: {
      weight: 'weight'
    }
  });
  console.log('Betweenness Centrality with Inverted Weights:', betweenness);
  // 10배 이상 높게 차이남

  
  // IQR 기반 이상치 탐지 함수
  const detectOutliersIQR = (metric) => { // 결과를 quarter로 나누어, q1, q3 상위 25%와 하위 25%를 
    const values = Object.values(metric).sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length / 4)];
    const q3 = values[Math.floor((values.length * 3) / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return Object.keys(metric).filter(node => metric[node] < lowerBound || metric[node] > upperBound);
  };

  const detectOutliersSTD = (metric) => {
    const values = Object.values(metric);
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
    const lowerBound = mean - 2 * stdDev;
    const upperBound = mean + 2 * stdDev;
    return Object.keys(metric).filter(node => metric[node] < lowerBound || metric[node] > upperBound);
  };
  
  // PageRank 이상치 탐지
  const pageRankOutliers = detectOutliersSTD(ranks);
  console.log('PageRank Outliers:', pageRankOutliers);
  
  // Degree Centrality 이상치 탐지
  const degreeOutliers = detectOutliersSTD(degrees);
  console.log('Degree Centrality Outliers:', degreeOutliers);
  
  // Closeness Centrality 이상치 탐지
  const closenessOutliers = detectOutliersSTD(closeness);
  console.log('Closeness Centrality Outliers:', closenessOutliers);
  
  // Betweenness Centrality 이상치 탐지
  const betweennessOutliers = detectOutliersSTD(betweenness);
  console.log('Betweenness Centrality Outliers:', betweennessOutliers);
  
  // 모든 노드를 검사하여 콜루션을 탐지하는 함수
  const detectCollusion = (pageRank, degreeCentrality, closenessCentrality, betweennessCentrality, louvainCommunities) => {
    const collusionDetectedNodes = [];
  
    const allNodes = Object.keys(pageRank);
    let expectedGroup = []
    let groupCounter = {}
    allNodes.forEach(node => {
      const pageRankOutlier = pageRankOutliers.includes(node);
      const degreeOutlier = degreeOutliers.includes(node);
      const closenessOutlier = closenessOutliers.includes(node);
      const betweennessOutlier = betweennessOutliers.includes(node);
      

      if (pageRankOutlier || degreeOutlier || closenessOutlier || betweennessOutlier) {
        const communityNodes = allNodes.filter(n => louvainCommunities[n] === louvainCommunities[node]);
        console.log(communityNodes, "communityNodes")
        const highInteractions = communityNodes.filter(n => loadedGraph.edge(node, n) && loadedGraph.getEdgeAttribute(loadedGraph.edge(node, n), 'weight') > 90 );
        console.log(highInteractions, communityNodes.length)

        highInteractions.forEach(interaction => {
            if (!groupCounter[interaction]) {
                groupCounter[interaction] = 0;
            } // 없으면 0으로 초기화 시켜야 NaN이 출력되지 않음
            groupCounter[interaction] += 1;
            console.log(groupCounter)
            if(groupCounter[interaction] > 1){
                if(!expectedGroup.includes(interaction)){
                    expectedGroup.push(interaction)
                }
                console.log(`${interaction} is likely involved in collusion.`)
            } 
            
        })
        expectedGroup.sort((a, b) => a.localeCompare(b))
        console.log(expectedGroup, "expectedGroup result")
        expectedGroup.forEach(node => {
            if(!collusionDetectedNodes.includes(node))
                collusionDetectedNodes.push(node)
        })
        console.log(collusionDetectedNodes,"collusion")
        //collusionDetectedNodes.push(...expectedGroup);        
      }
    });
  
    return collusionDetectedNodes;
  };
  
  const collusionDetectedNodes = detectCollusion(ranks, degrees, closeness, betweenness, louvainCommunities);
  if (collusionDetectedNodes.length > 0) {
    console.log('Collusion detected among the following nodes:', collusionDetectedNodes);
  } else {
    console.log('No collusion detected.');
  }
  
  // 그래프 시각화를 위한 HTML 파일 생성
  const createHTMLVisualization = (graph, communities) => {
      const nodes = graph.nodes().map(node => ({ id: node, group: communities[node] }));
      const edges = graph.edges().map(edge => ({
        source: graph.source(edge),
        target: graph.target(edge),
        weight: graph.getEdgeAttribute(edge, 'weight')
      }));
    
      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <script src="https://d3js.org/d3.v5.min.js"></script>
        <style>
          .node circle {
            stroke: #404040;
            stroke-width: 1.5px;
          }
          .link {
            stroke: #999;
            stroke-opacity: 0.6;
          }
        </style>
      </head>
      <body>
        <script>
          var nodes = ${JSON.stringify(nodes)};
          var links = ${JSON.stringify(edges)};
          var color = d3.scaleOrdinal(d3.schemeCategory10);
    
          var width = 960, height = 600;
    
          var svg = d3.select("body").append("svg")
              .attr("width", width)
              .attr("height", height);
    
          var simulation = d3.forceSimulation(nodes)
              .force("link", d3.forceLink(links).id(d => d.id).distance(d => 100 / d.weight))
              .force("charge", d3.forceManyBody().strength(-200))
              .force("center", d3.forceCenter(width / 2, height / 2));
    
          var link = svg.append("g")
              .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
              .attr("class", "link")
              .attr("stroke-width", d => Math.sqrt(d.weight));
    
          var node = svg.append("g")
              .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g")
              .attr("class", "node");
    
          node.append("circle")
              .attr("r", 5)
              .attr("fill", d => color(d.group));
    
          node.append("title")
              .text(d => d.id);
    
          simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
    
            node
                .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
          });
        </script>
      </body>
      </html>
      `;
    
      writeFileSync('graph.html', htmlContent);
    };
    
    createHTMLVisualization(loadedGraph, louvainCommunities);