$(function(){
    let href = location.href;
    let $table = $('#featuresTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/system_features/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'feature_id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: featureDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'feature_name',
            title: 'Feature',
            filterControl: 'input',
            sortable: true
        }]
    });
})

const featureDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_system_features' +'/' + href.substr(href.lastIndexOf('/') + 1) + '/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}

const addFeatures = function() {
    let href = location.href;
    let features = $('#features').val();
    $.ajax({
        url: '../../api/syssel/add_system_features/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            features: features
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#featuresTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added Categories');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the categories');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}