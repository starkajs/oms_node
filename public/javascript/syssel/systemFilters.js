const filterSystems = function() {
    let features = $('#featFilter').val();
    let modules = $('#moduleFilter').val();
    let categories = $('#catFilter').val();
    $.ajax({
        url: '../../api/syssel/filter_systems',
        type: 'POST',
        data: {
            features: features,
            modules: modules,
            categories: categories
        },
        success: function(data, status){
            // $('#table').bootstrapTable('load', data);
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Filtering completed');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error filtering the systems');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}