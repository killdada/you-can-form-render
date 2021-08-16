export function redirect(location = '/') {
  const hashReg = /^#w+/;
  if (hashReg.test(location)) {
    window.location.hash = location;
    return;
  }
  window.location.href = location;
}

export function goback() {
  window.history.back();
}
