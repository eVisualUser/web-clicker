// Source: https://www.javascripttutorial.net/web-apis/javascript-cookies/

class Cookie {
    static get(name) {
      const cookieName = `${encodeURIComponent(name)}=`;
      const cookie = document.cookie;
      let value = null;
  
      const startIndex = cookie.indexOf(cookieName) + 1;
      if (startIndex > -1) {
        let endIndex = cookie.indexOf(';', startIndex);
        if (endIndex == -1) {
          endIndex = cookie.length;
        }
        value = decodeURIComponent(
          cookie.substring(startIndex + name.length, endIndex)
        );
      }
      return value;
    }
  
    static set(name, value, expires, path, domain, secure) {
      let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      if (expires instanceof Date) {
        console.log("Expire: " + expires.toGMTString());
        cookieText += `; expires=${expires.toGMTString()}`;
      }
  
      cookieText += '; SameSite=Strict';
      if (path) cookieText += `; path=${path}`;
      if (domain) cookieText += `; domain=${domain}`;
      if (secure) cookieText += `; secure`;
  
      document.cookie = cookieText;
    }
  
    static remove(name, path, domain, secure) {
      Cookie.set(name, '', new Date(0), path, domain, secure);
    }
  }
  