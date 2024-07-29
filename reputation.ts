// import Graph from 'graphology';
// import { writeFileSync } from 'fs';

// // 20명의 사용자 생성
// const users = Array.from({ length: 20 }, (_, i) => `User${i + 1}`);
// const reputation: { [key: string]: number[] } = {};
// users.forEach(user => reputation[user] = []);

// // 그래프 생성
// const graph = new Graph({ type: 'directed' });

// // 노드 추가
// users.forEach(user => graph.addNode(user));

// // 특정 그룹이 서로 평가 (예: User1, User2, User3, User4)
// const specificGroup = ['User1', 'User2', 'User3', 'User4'];

// // 특정 그룹이 서로 높은 점수로 평가 (예: 80에서 100 사이)
// specificGroup.forEach((from, i) => {
//   specificGroup.forEach((to, j) => {
//     if (i !== j) {
//       const score = 80 + Math.floor(Math.random() * 21);
//       graph.addEdge(from, to, { score });
//       reputation[to].push(score);
//     }
//   });
// });

// // 나머지 사용자들이 랜덤하게 평가 (0에서 100 사이)
// const getRandomInt = (max: number) => Math.floor(Math.random() * max);

// for (let i = 0; i < users.length; i++) {
//   for (let j = 0; j < users.length; j++) {
//     if (i !== j && !(specificGroup.includes(users[i]) && specificGroup.includes(users[j]))) {
//       const shouldEvaluate = Math.random() > 0.5; // 50% 확률로 평가
//       if (shouldEvaluate) {
//         const score = getRandomInt(101);
//         graph.addEdge(users[i], users[j], { score });
//         reputation[users[j]].push(score);
//       }
//     }
//   }
// }

// // 각 사용자의 평균 점수 계산
// const averageReputation: { [key: string]: number } = {};
// for (const user of users) {
//   const scores = reputation[user];
//   const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
//   averageReputation[user] = averageScore || 0; // 평가를 받지 않은 경우 0으로 설정
// }

// // 그래프 데이터 저장
// const graphData = graph.export();
// writeFileSync('reputationGraph.json', JSON.stringify(graphData, null, 2));

// // 그래프 및 평판 출력
// console.log('Graph:', graph);
// console.log('Reputation:', averageReputation);
