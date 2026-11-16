(function(H){
const acct=H.auth.current();
if(acct)H.boot(acct);else H.authScreen();
})(Hub);
