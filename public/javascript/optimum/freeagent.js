const getToken = function() {
    const params = {
        "client_id": 'ux3SNZaOby9dQ31XXChJcA',
        "response_type": 'code',
        "state": 'state',
        "redirect_uri": 'http://localhost:5000/freeagent/freeagent_callback',
    };
    let base = `https://api.freeagent.com/v2/approve_app?`
    let url_component = `redirect_uri=${params['redirect_uri']}&response_type=${params['response_type']}&client_id=${params['client_id']}&state=${params['state']}`
    let url = base + encodeURIComponent(url_component);
    console.log(url);
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data, status) {
            console.log(data)
        }
    })
}