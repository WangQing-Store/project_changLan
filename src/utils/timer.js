import { refreshToken } from '@/api/login'
import { getToken, setToken } from '@/utils/auth'

export function timer() {
  const oldToken = getToken()
  // refreshToken(oldToken).then(response => {
  //   const data = response.data
  //   setToken(data.data.jws)
  //   localStorage.setItem('ExpirationTime', data.data.expirationTime)
  // })
  // console.log(localStorage.getItem('ExpirationTime'));
  // console.log(new Date().getTime());
  let timecha = localStorage.getItem('ExpirationTime') - new Date().getTime();
  return setInterval(() => {
    const nowTime = new Date().getTime()
    const timeValue = localStorage.getItem('ExpirationTime')
    const old = getToken()
    refreshToken(old).then(response => {
      const data = response.data
      setToken(data.data.jws)
      localStorage.setItem('ExpirationTime', data.data.expirationTime)
    })
  },timecha)
}
