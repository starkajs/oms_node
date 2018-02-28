$(function(){
    let href = location.href;
    let $table = $('#modulesTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/system_modules/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: moduleDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'module_name',
            title: 'Module',
            filterControl: 'input',
            sortable: true
        }]
    });
})

const moduleDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_system_modules' +'/' + href.substr(href.lastIndexOf('/') + 1) + '/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}

const addModules = function() {
    let href = location.href;
    let modules = $('#modules').val();
    $.ajax({
        url: '../../api/syssel/add_system_modules/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            modules: modules
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#modulesTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added Modules');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the modules');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}