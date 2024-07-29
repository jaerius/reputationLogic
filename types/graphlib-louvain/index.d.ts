declare module 'graphlib-louvain' {
    import { Graph } from 'graphlib';
  
    class Louvain {
      constructor(graph: Graph);
      run(): { [key: string]: string[] };
    }
  
    export = Louvain;
  }
  