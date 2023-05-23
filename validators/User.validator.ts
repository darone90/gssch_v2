export default (login:string | null,password:string | null):boolean => {
  if(login && login.length < 4) return false;
  if(password && password.length < 6) return false;
  return true;
}