

export function ApproximateToNthDigit(value, x) {
  return (
    Math.round((value + Number.EPSILON) * Math.pow(10, x)) / Math.pow(10, x)
  )
}


export function unixToDateTime(unixDate) {
  
  var date = new Date(unixDate * 1);
  return date.toUTCString()
}



export function logout() {
  localStorage.setItem('token', '')
  localStorage.setItem('password', '')
  localStorage.setItem('username', '')
  localStorage.setItem('userId', '')
  localStorage.setItem('cartCount', '')
  window.location.href = '/'
}

export function isLoggedIn() {
  if (localStorage.getItem('token') && localStorage.getItem('token') !== '') {
    return true
  } else {
    return false
  }
}

export function getWindowSize() {
  let windowSize = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // window.addEventListener("resize", getWindowSize);

  return windowSize
}

export function loginLocalStorage(token, username, password,userId,cartCount) {
  localStorage.setItem('token', token)
  localStorage.setItem('username', username)
  localStorage.setItem('password', password)
  localStorage.setItem('userId', userId)
  localStorage.setItem('cartCount', cartCount)
}