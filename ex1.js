// const Graph = require('graphology');
// const { readFileSync, writeFileSync } = require('fs');
// const pagerank = require('graphology-metrics/centrality/pagerank');
// const { degreeCentrality } = require('graphology-metrics/centrality/degree');
// const closenessCentrality = require('graphology-metrics/centrality/closeness');
// const betweennessCentrality = require('graphology-metrics/centrality/betweenness');
// const louvain = require('graphology-communities-louvain');


// const fromJson = (GraphConstructor, json) => {
//     const graph = new GraphConstructor();
//     json.nodes.forEach(node => graph.addNode(node.key, node.attributes));
//     json.edges.forEach(edge => graph.addEdge(edge.source, edge.target, edge.attributes))
//     return graph
// }

// const ToJson = (graph) => {
//     return {
//         nodes : graph.nodes().map(node => ({key : node.key, attributes : graph.getNdoeAttributes(node)} )),
//         edges : graph.edges().map(edge => ({source : edge.source, target : edge.target, attributes : edge.getEdgeAttributes(edge)}))
//     }
// }

// const generateGraphData = () => {
//     const graph = new Graph();
//     const users = Array.from({length : 20}, (_, i) => {`User${i+1}`}) 

//     const maliciousNodes = [`User1`, `User2`, `User3`];

//     const fakeWallets = Array.from({length : 10}, (_,i) => {`fake${i+1}`})
//     maliciousNodes.forEach(source => {
//         maliciousNodes.forEach(target => {
//             if(source !== target){
//                 graph.addEdge(source, target, {weight: 100})
//             }
//         })
//         users.filter(user => !maliciousNodes.includes(user).forEach(target => {
//             graph.addEdge(source, target, {weight : 10})
//         }))
//         }
//     )

//     fakeWallets.forEach(wallet => {
//         maliciousNodes.forEach(target =>{
//             graph.addEdge(wallet, target, {weight: 100})
//         })
//     })

    

//     users.filter(user => !maliciousNodes.includes(user).forEach(source => 
//         forEach(target => {
//             if(source !== target && !graph.hasEdge(source, target)){
//                 graph.addEdge(source, target, { weight: Math.floor(Math.random() * 100) + 1 })
//             }
//         })
//     ))

//     const detectOutliersIQR = (metrics) => {
//         const values = Object.values(metric).sort((a,b) => a-b) // 오름차순 정렬 Object.values는 객체의 모든 값을 배열로 반환
//         const q1 = values[Math.floor(values.length / 4)]
//         const q3 = values[Math.floor(values.length * 3 / 4)]
//         const iqr = q3 - q1
//         const lowerBound = q1 - 1.5 * iqr;
//         const upperBound = q3 + 1.5 * iqr;

//         return Object.keys(metrics).filter(node => metrics[node] < lowerBound || metrics[node] > upperBound) // 객체의 모든 키를 배열로 반환
//     }

//     const analyzeCollusion = (graph, nodes) => {
//         const interactions = {};
//         nodes.forEach(node => {
//             interactions[node] = {}
//             nodes.forEach(target => {
//                 if(node !== target){
//                     const edge = graph.edge(node, target)
//                     interactions[node][target] = edge ? graph.getEdgeAttribute(edge, 'weight') : 0
//                 }
//             })
//         })
//         return interactions
//     }

//     const collusionNodes = ['User1', 'User2', 'User3']
//     const collusionAnalysis = analyzeCollusion(loadedGraph, collusionNodes)

//     const analyzeOtherRatings = (graph, nodes, allNodes) => {
//         const otherRatings = {}
//         nodes.forEach(node => {
//             otherRatings[node] = {}
//             allNodes.forEach(target => {
//                 if(!nodes.includes(target)){
//                     const edge = graph.edge(node, target)
//                     if(edge)
//                         otherRatings[node].push(graph.getEdgeAttribute(edge, 'weight'))
//             }})
//         })
//         return otherRatings
//     }

//     const detectCollusion = (collusionAnalysis, otherRatings) => {
//         let collusionAnalysis = false;
//         collusionNodes.forEach(node => {
//             const highRatings = Object.values(collusionAnalysis[node]).filter(rating => rating >= 90)
//             const lowRatings = otherRatings[node].filter(rating => rating <= 20);
//             if(highRatings.length === collusionNodes.length - 1 && lowRatings.length > 0){
//                 collusionDetected = true
//                 console.log(`${node} is likely involved in collusion.`);
//             }
//         })
//         return collusionDetected
//     }
    
//     const collusionDetected = detectCollusion(collusionAnalysis, otherRatings);
//     if(collusionDetected){

//     }

// }




// const Graph = require('graphology');
// const { readFileSync, writeFileSync } = require('fs');
// const pagerank = require('graphology-metrics/centrality/pagerank');
// const { degreeCentrality } = require('graphology-metrics/centrality/degree');
// const closenessCentrality = require('graphology-metrics/centrality/closeness');
// const betweennessCentrality = require('graphology-metrics/centrality/betweenness');
// const louvain = require('graphology-communities-louvain');

// // fromJSON 함수를 정의하여 그래프 데이터를 JSON에서 불러오는 기능 구현
// const fromJSON = (GraphConstructor, json) => {
//   const graph = new GraphConstructor();
//   json.nodes.forEach(node => graph.addNode(node.key, node.attributes));
//   json.edges.forEach(edge => graph.addEdge(edge.source, edge.target, edge.attributes));
//   return graph;
// };

// // toJSON 함수를 정의하여 그래프 데이터를 JSON으로 변환하는 기능 구현
// const toJSON = (graph) => {
//   return {
//     nodes: graph.nodes().map(node => ({ key: node, attributes: graph.getNodeAttributes(node) })),
//     edges: graph.edges().map(edge => ({
//       source: graph.source(edge),
//       target: graph.target(edge),
//       attributes: graph.getEdgeAttributes(edge)
//     }))
//   };
// };

// // 평판 데이터를 생성하고 그래프를 구성하는 함수
// const generateGraphData = () => {
//   const graph = new Graph();
//   const users = Array.from({ length: 20 }, (_, i) => `User${i + 1}`);
//   users.forEach(user => graph.addNode(user));

//   // 악의적인 노드와 가짜 지갑 생성
//   const maliciousNodes = ['User1', 'User2', 'User3'];
//   const fakeWallets = Array.from({ length: 10 }, (_, i) => `Fake${i + 1}`);

//   // 악의적인 노드 평가 로직
//   maliciousNodes.forEach(source => { // mailciousNodes 배열의 각 요소에 대해 source로 설정
//     maliciousNodes.forEach(target => { // user가 다른 malicious 유저에게 평가를 내리는 경우
//       if (source !== target) {
//         graph.addEdge(source, target, { weight: 100 });
//       }
//     });
//     fakeWallets.forEach(fake => { // fakewallet이 malicious 유저에게 평가를 내리는 경우
//       if (!graph.hasNode(fake)) {
//         graph.addNode(fake);
//       }
//       graph.addEdge(fake, source, { weight: 100 });
//     });
//     users.filter(user => !maliciousNodes.includes(user)).forEach(target => { // malicious 유저가 아닌 다른 유저들에게 평가를 내리는 경우
//       graph.addEdge(source, target, { weight: 10 }); // malicious 유저가 다른 non malicious 유저에게 10점 부여
//     });
//   });

//   // 다른 사용자들의 평가 로직
//   users.filter(user => !maliciousNodes.includes(user)).forEach(source => { // malicious 유저가 아닌 다른 유저들, maliciousNodes.includes(user)가 false인 경우
//     users.forEach(target => { // forEach 메소드: 배열의 각 요소에 대해 주어진 함수를 실행
//       if (source !== target && !graph.hasEdge(source, target)) {
//         graph.addEdge(source, target, { weight: Math.floor(Math.random() * 100) + 1 }); // 1부터 100 중에 랜덤으로 값 생성
//       }
//     });
//   });

//   return graph;
// };

// // 그래프 데이터를 생성하고 JSON으로 저장
// const graph = generateGraphData();
// const graphDataJSON = toJSON(graph);
// writeFileSync('reputationGraph.json', JSON.stringify(graphDataJSON, null, 2));

// // 그래프 로드
// const loadedGraphData = JSON.parse(readFileSync('reputationGraph.json', 'utf8'));
// const loadedGraph = fromJSON(Graph, loadedGraphData);

// // Louvain 커뮤니티 탐지
// const louvainCommunities = louvain(loadedGraph);
// console.log('Louvain Communities:', louvainCommunities);

// // PageRank 계산
// const ranks = pagerank(loadedGraph);
// console.log('PageRank:', ranks);

// // Degree Centrality 계산
// const degrees = degreeCentrality(loadedGraph);
// console.log('Degree Centrality:', degrees);

// // Closeness Centrality 계산
// const closeness = closenessCentrality(loadedGraph);
// console.log('Closeness Centrality:', closeness);

// // Betweenness Centrality 계산
// const betweenness = betweennessCentrality(loadedGraph);
// console.log('Betweenness Centrality:', betweenness);

// // IQR 기반 이상치 탐지 함수
// const detectOutliersIQR = (metric) => { // 결과를 quarter로 나누어, q1, q3 상위 25%와 하위 25%를 
//   const values = Object.values(metric).sort((a, b) => a - b);
//   const q1 = values[Math.floor(values.length / 4)];
//   const q3 = values[Math.floor((values.length * 3) / 4)];
//   const iqr = q3 - q1;
//   const lowerBound = q1 - 1.5 * iqr;
//   const upperBound = q3 + 1.5 * iqr;
//   return Object.keys(metric).filter(node => metric[node] < lowerBound || metric[node] > upperBound);
// };

// // PageRank 이상치 탐지
// const pageRankOutliers = detectOutliersIQR(ranks);
// console.log('PageRank Outliers:', pageRankOutliers);

// // Degree Centrality 이상치 탐지
// const degreeOutliers = detectOutliersIQR(degrees);
// console.log('Degree Centrality Outliers:', degreeOutliers);

// // Closeness Centrality 이상치 탐지
// const closenessOutliers = detectOutliersIQR(closeness);
// console.log('Closeness Centrality Outliers:', closenessOutliers);

// // Betweenness Centrality 이상치 탐지
// const betweennessOutliers = detectOutliersIQR(betweenness);
// console.log('Betweenness Centrality Outliers:', betweennessOutliers);

// // User1, User2, User3 사이의 상호 평가 분석
// const analyzeCollusion = (graph, nodes) => {
//   const interactions = {};
//   nodes.forEach(node => {
//     interactions[node] = {};
//     nodes.forEach(target => {
//       if (node !== target) {
//         const edge = graph.edge(node, target);
//         interactions[node][target] = edge ? graph.getEdgeAttribute(edge, 'weight') : 0;
//       }
//     });
//   });
//   return interactions;
// };

// const collusionNodes = ['User1', 'User2', 'User3'];
// const collusionAnalysis = analyzeCollusion(loadedGraph, collusionNodes);
// console.log('Collusion Analysis among User1, User2, User3:', collusionAnalysis);

// // 다른 사용자들에 대한 평가 점수 분석
// const analyzeOtherRatings = (graph, nodes, allNodes) => {
//   const otherRatings = {};
//   nodes.forEach(node => {
//     otherRatings[node] = [];
//     allNodes.forEach(target => {
//       if (!nodes.includes(target)) {
//         const edge = graph.edge(node, target);
//         if (edge) {
//           otherRatings[node].push(graph.getEdgeAttribute(edge, 'weight'));
//         }
//       }
//     });
//   });
//   return otherRatings;
// };

// const allNodes = loadedGraph.nodes();
// const otherRatings = analyzeOtherRatings(loadedGraph, collusionNodes, allNodes);
// console.log('Other Ratings by User1, User2, User3:', otherRatings);

// // User1, User2, User3가 그룹을 형성하고 다른 사람들을 악용하는지 판단
// const detectCollusion = (collusionAnalysis, otherRatings) => {
//   let collusionDetected = false;
//   collusionNodes.forEach(node => {
//     const highRatings = Object.values(collusionAnalysis[node]).filter(rating => rating >= 90);
//     const lowRatings = otherRatings[node].filter(rating => rating <= 20);

//     const communities = (louvainCommunities.User1 === louvainCommunities.User2 ) && (louvainCommunities.User2 === louvainCommunities.User3)
//     console.log(communities, "communities")

//     if (highRatings.length === collusionNodes.length - 1 && lowRatings.length > 0) {
//         if(communities) {
//         collusionDetected = true;
//         console.log(`${node} is likely involved in collusion.`);
//         }
//     }
//   });
//   return collusionDetected;
// };

// const collusionDetected = detectCollusion(collusionAnalysis, otherRatings);
// if (collusionDetected) {
//   console.log('Collusion detected among User1, User2, and User3.');
// } else {
//   console.log('No collusion detected among User1, User2, and User3.');
// }

// const checkCollusion = (graph, nodes) => {
//     nodes.forEach(node => {
        
//     })
// }

// // 그래프 시각화를 위한 HTML 파일 생성
// const createHTMLVisualization = (graph, communities) => {
//     const nodes = graph.nodes().map(node => ({ id: node, group: communities[node] }));
//     const edges = graph.edges().map(edge => ({
//       source: graph.source(edge),
//       target: graph.target(edge),
//       weight: graph.getEdgeAttribute(edge, 'weight')
//     }));
  
//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="utf-8">
//       <script src="https://d3js.org/d3.v5.min.js"></script>
//       <style>
//         .node circle {
//           stroke: #404040;
//           stroke-width: 1.5px;
//         }
//         .link {
//           stroke: #999;
//           stroke-opacity: 0.6;
//         }
//       </style>
//     </head>
//     <body>
//       <script>
//         var nodes = ${JSON.stringify(nodes)};
//         var links = ${JSON.stringify(edges)};
//         var color = d3.scaleOrdinal(d3.schemeCategory10);
  
//         var width = 960, height = 600;
  
//         var svg = d3.select("body").append("svg")
//             .attr("width", width)
//             .attr("height", height);
  
//         var simulation = d3.forceSimulation(nodes)
//             .force("link", d3.forceLink(links).id(d => d.id).distance(d => 100 / d.weight))
//             .force("charge", d3.forceManyBody().strength(-200))
//             .force("center", d3.forceCenter(width / 2, height / 2));
  
//         var link = svg.append("g")
//             .attr("class", "links")
//           .selectAll("line")
//           .data(links)
//           .enter().append("line")
//             .attr("class", "link")
//             .attr("stroke-width", d => Math.sqrt(d.weight));
  
//         var node = svg.append("g")
//             .attr("class", "nodes")
//           .selectAll("g")
//           .data(nodes)
//           .enter().append("g")
//             .attr("class", "node");
  
//         node.append("circle")
//             .attr("r", 5)
//             .attr("fill", d => color(d.group));
  
//         node.append("title")
//             .text(d => d.id);
  
//         simulation.on("tick", () => {
//           link
//               .attr("x1", d => d.source.x)
//               .attr("y1", d => d.source.y)
//               .attr("x2", d => d.target.x)
//               .attr("y2", d => d.target.y);
  
//           node
//               .attr("transform", d => "translate(" + d.x + "," + d.y + ")");
//         });
//       </script>
//     </body>
//     </html>
//     `;
  
//     writeFileSync('graph.html', htmlContent);
//   };
  
//   createHTMLVisualization(loadedGraph, louvainCommunities);