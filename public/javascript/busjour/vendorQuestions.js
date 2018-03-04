const populateTable = async function() {
    $.fn.editable.defaults.mode = 'inline';
    let journey_id = $('#journey_id').text();
    let vendor_id = $('#vendor_id').text();
    let $table = $('#questionsTable').bootstrapTable({
        idField: 'id',
        url: `../../../api/journey/vendor_questions/${journey_id}/${vendor_id}` ,
        idField: 'question_id',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'question_id',
            title: 'ID',
            visible: false
        },{
            field: 'vendor_id',
            title: 'Vendor ID',
            visible: false
        }, {
            field: 'category_name',
            title: 'Category',
            sortable: true,
            filterControl: 'input',
            width: '15%'
        }, {
            field: 'evaluation_question',
            title: 'Question',
            filterControl: 'input',
            width: '30%'
        },{
            field: 'question_type',
            title: 'Question Type',
            visible: false
        },{
            field: 'response_boolean',
            title: 'Y/N',
            editable: {
                type: 'select',
                source: [{value:0, text:'No'},{value:1, text:'Yes'}]
            },
            halign: 'center',
            align: 'center',
            valign: 'center'
        },{
            field: 'response_integer',
            title: 'Number',
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            valign: 'center'
        },{
            field: 'response_percent',
            title: 'Percent',
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            valign: 'center'
        },{
            field: 'response_comment',
            title: 'Comment',
            editable: {
                type: 'textarea'
            }
        }]
    });
    $table.on('load-success.bs.table', function(data){
        $tableRows = $table.find('tbody tr');
        tableData = $table.bootstrapTable('getData', true);
        $.each(tableData, function(i, row){
            qt = row['question_type'];
            switch (qt) {
                case 'boolean':
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    break;
                case 'integer':
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    break;
                case 'percent':
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    break;
                default:
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    break;
            }
        });
    });
    $table.on('page-change.bs.table', function(data){
        $tableRows = $table.find('tbody tr');
        tableData = $table.bootstrapTable('getData', true);
        $.each(tableData, function(i, row){
            qt = row['question_type'];
            switch (qt) {
                case 'boolean':
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    break;
                case 'integer':
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    break;
                case 'percent':
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    break;
                default:
                    $tableRows.eq(i).find("a[data-name='response_integer']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_percent']").editable('toggleDisabled');
                    $tableRows.eq(i).find("a[data-name='response_boolean']").editable('toggleDisabled');
                    break;
            }
        });
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        let update_field = '';
        if (field != 'response_comment') {
            let question_type = row['question_type'];
            switch (question_type) {
                case 'integer':
                    update_field = 'response_integer';
                    break;
                case 'boolean':
                    update_field = 'response_boolean';
                    break;
                case 'percent':
                    update_field = 'response_percent';
                    break;
                case 'text':
                    update_field = 'response_text';
                    break;
                case 'response_comment':
                    update_field = 'response_comment'
                    break;
                default:
                    update_field = field
            }
        } else {
            update_field = field;
        }

        $.ajax({
            url: '../../../api/journey/vendor_question',
            type: 'POST',
            data: {
                journey_id: row['journey_id'],
                question_id: row['question_id'],
                vendor_id: row['vendor_id'],
                update_field: update_field,
                update_value: row[field]
            },
            success: function(data, status){
                $('#questionsTable').bootstrapTable('refresh');
                // $('#update_message').removeClass();
                // $('#update_message').addClass("alert alert-success text-center");
                // $('#update_message').text(data.message);
                // $('#update_message').delay(500).fadeIn('normal', function(){
                //     $(this).delay(2500).fadeOut();
                // })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-danger text-center");
                $('#update_message').text(data.error);
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        });
    });
}

$(function(){
    populateTable();
})

const populateQuestions = () => {
    let journey_id = $('#journey_id').text();
    let vendor_id = $('#vendor_id').text();
    $.ajax({
        url: '../../../api/journey/populate_evaluation_questions',
        type: 'POST',
        data: {
            journey_id: journey_id,
            vendor_id: vendor_id
        },
        success: function(data, status){
            $('#questionsTable').bootstrapTable('refresh');
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-danger text-center");
            $('#update_message').text(data.error);
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    });
}

const responseValueFormatter = (value, row) => {
    switch (row['question_type']) {
        case 'boolean':
            return row['response_boolean'];
            break;
        case 'integer':
            return row['response_integer'];
            break;
        case 'percent':
            return row['response_percent'];
            break;
        case 'text':
            return row['response_text'];
            break;
        default:
            return ''
            break;
    }
}
