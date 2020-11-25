
export function getDictName(status, key) {
  const list = JSON.parse(localStorage.getItem('Dict'))
  var d_name
  for(var i = 0; i < list.length; i++) {
    if(list[i].value == status && list[i].key == key) {
      d_name = list[i].name
    }
  }
  return d_name
}
