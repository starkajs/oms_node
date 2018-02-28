$(function(){
    let href = location.href;
    let $table = $('#categoriesTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/system_categories/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'category_id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: categoryDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'category_name',
            title: 'Category',
            filterControl: 'input',
            sortable: true
        }]
    });
})

const categoryDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_system_categories' +'/' + href.substr(href.lastIndexOf('/') + 1) + '/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}

const addCategories = function() {
    let href = location.href;
    let categories = $('#categories').val();
    $.ajax({
        url: '../../api/syssel/add_system_categories/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            categories: categories
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#categoriesTable').bootstrapTable('refresh');
            $('#categories').find($('option')).attr('selected',false)
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