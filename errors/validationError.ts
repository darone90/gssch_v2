class ValidationError extends Error {
  public code: number;
  public source: string;

 constructor( message: string, source:string, ){
   super(message);
   this.code = 400;
   this.source = source;
 }
}

export default ValidationError
