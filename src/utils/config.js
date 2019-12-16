const local = true
console.log('IS_LOCAL', local)

export default {
  apiUrl: local ? 'http://localhost:9098/v1' : 'https://api.blankoapp.com/v1'
}
