export const isEmpty = value => {
  if (!value) return true
  return false
}

export const isEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const isName = name => {
  if (name.length < 2 || !name.match(/^[A-Za-z- ]+$/)) return false
  return true
}

export const isPhone = phone => {
  if (phone.length !== 10 || !phone.match(/^\d{10}$/)) return false
  return true
}

export const isValidPassword = password => {
  if (password.length < 6) return false
  return true
}

export const isMatch = (password, cf_password) => {
  if (password === cf_password) return true
  return false
}
