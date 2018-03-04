$(function(){
    $.fn.editable.defaults.mode = 'inline';
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/optimum/prime/',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 700,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'phase_name',
            title: 'Phase',
            editable: {
                type: 'text'
            }
        }, {
            field: 'stage_name',
            title: 'Stage',
            editable: {
                type: 'text'
            }
        }, {
            field: 'stage_description',
            title: 'Stage Description',
            editable: {
                type: 'textarea'
            }
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/optimum/prime',
            type: 'POST',
            data: {
                stage_id: row['id'],
                update_field: field,
                update_value: row[field]
            },
            success: function(data, status){
                $('#table').bootstrapTable('refresh');
                // $('#update_message').removeClass();
                // $('#update_message').addClass("alert alert-success text-center");
                // $('#update_message').text(data.message);
                // $('#update_message').delay(500).fadeIn('normal', function(){
                //     $(this).delay(2500).fadeOut();
                // })
            },
            error: function(data, status){
                $('#table').bootstrapTable('refresh')
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-danger text-center");
                $('#update_message').text(data.error);
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        });
    });
})


