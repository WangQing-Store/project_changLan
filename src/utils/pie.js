import { getAnalysis } from '@/api/alarm/untreated'

export function analysis() {
  let data = []
  getAnalysis().then(response => {
    let res = response.data.data
    res.forEach(function(item){
      data.push({ 'value':item.value, 'name':item.name })
    })
  })
  return data
}
