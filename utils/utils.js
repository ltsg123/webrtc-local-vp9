export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

export function log(...args) {
  console.log(`[${getDateStr()}]`, ...args);
}

function getDateStr() {
  const date = new Date();
  const dateStr =
    date.toTimeString().split(" ")[0] + ":" + date.getMilliseconds();
  return dateStr;
}

export function getRandomString(length = 7, prefix) {
  const str = Math.random().toString(16).substr(2, length).toLowerCase();
  if (str.length === length) return `${prefix}${str}`;

  return `${prefix}${str}` + getRandomString(length - str.length, "");
}
