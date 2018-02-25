$.fn.editable.defaults.mode = 'inline';
$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/admin/roles',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 600,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        }, {
            field: 'role_name',
            title: 'Role',
            filterControl: 'input',
            editable: {
                type: 'text'
            }
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../api/admin/update_solution_role',
            type: 'POST',
            data: {
                role_id: row['id'],
                update_field: field,
                update_value: row[field]
            },
            success: function(data, status){
                if (data['error']) {
                    $('#update_message').removeClass();
                    $('#update_message').addClass("alert alert-danger text-center")
                } else {
                    $('#update_message').removeClass();
                    $('#update_message').addClass("alert alert-success text-center")
                }
                $('#update_message').text(data.message);
                $('#update_message').delay(500).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-danger text-center")
                $('#update_message').text(data.responseJSON.message);
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })

            }
        });
    });
})