class HTTPError extends Error {
   public code: number;
   public source: string;
   public blockName: string;

  constructor(code: number, message: string, source:string, blockName: string){
    super(message);
    this.code = code;
    this.source = source;
    this.blockName = blockName;
  }
}

export default HTTPError
