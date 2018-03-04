$(function(){
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/questions/'+ href.substr(href.lastIndexOf('/') + 1),
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
            field: 'evaluation_question',
            title: 'Question',
            editable: {
                type: 'textarea'
            }
        }, {
            field: 'question_type',
            title: 'Type',
            editable: {
                type: 'select',
                source: [{value: 'integer', text: 'Integer (Whole Number)'}, {value: 'boolean', text: 'Boolean (Y/N)'}, {value: 'percent', text: 'Percent'}, {value: 'text', text: 'Text'}]
            }
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/journey/evaluation_question',
            type: 'POST',
            data: {
                question_id: row['id'],
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


