import axios from 'axios';

axios.get('http://localhost:5000/loadData', {
    params: { user: "aneroodh14" }
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

// axios.get('http://localhost:5000/connection')
