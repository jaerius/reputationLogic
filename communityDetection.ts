// import Graph from 'graphology';
// import { readFileSync } from 'fs';
// import louvain from 'graphology-communities-louvain';

// // fromJSON 함수를 정의하여 그래프 데이터를 JSON에서 불러오는 기능 구현
// const fromJSON = (GraphConstructor: typeof Graph, json: any) => {
//   const graph = new GraphConstructor(json);
//   json.nodes.forEach((node: any) => graph.addNode(node.key, node.attributes));
//   json.edges.forEach((edge: any) => graph.addEdge(edge.source, edge.target, edge.attributes));
//   return graph;
// };

// // 그래프 로드
// const graphData = JSON.parse(readFileSync('reputationGraph.json', 'utf8'));
// const graph = fromJSON(Graph, graphData);

// // Louvain 커뮤니티 탐지
// const communities = louvain(graph);

// // 커뮤니티 출력
// console.log('Communities:', communities);

// // 악용 패턴 감지
// const communityMap: { [key: string]: string[] } = {};
// for (const [node, community] of Object.entries(communities)) {
//   if (!communityMap[community]) {
//     communityMap[community] = [];
//   }
//   communityMap[community].push(node);
// }

// Object.entries(communityMap).forEach(([community, members]) => {
//   if (members.length > 1) {
//     console.log(`Community ${community}: Possible collusion detected among ${members.join(', ')}`);
//   }
// });
