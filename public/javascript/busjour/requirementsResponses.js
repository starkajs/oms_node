const populateTable = async function() {
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/requirements_responses/' + href.substr(href.lastIndexOf('/') + 1),
        idField: 'solution_requirement_id',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'solution_requirement_id',
            title: 'ID',
            visible: false
        },{
            field: 'vendor_id',
            title: 'Vendor ID',
            visible: false
        },{
            field: 'vendor_name',
            title: 'Vendor',
            filterControl: 'input',
            sortable: true
        }, {
            field: 'module',
            title: 'Module',
            filterControl: 'input',
            formatter: moduleFormatter,
            visible: false,
            sortable: true
        },{
            field: 'process',
            title: 'Process',
            filterControl: 'input',
            formatter: processFormatter,
            visible: false,
            sortable: true
        },{
            field: 'requirement',
            title: 'Requirement',
            sortable: true,
            filterControl: 'input'
        }, {
            field: 'is_key_requirement',
            title: 'Key Req.',
            filterControl: 'input',
            sortable: true,
            halign: 'center',
            align: 'center',
            formatter: keyFormatter
        }, {
            field: 'moscow',
            title: 'MoSCoW',
            sortable: true,
            filterControl: 'input'
        },{
            field: 'response_value',
            title: 'Response',
            filterControl: 'input',
            sortable: true,
            editable: {
                type: 'select',
                source: [{value: 5, text: '5 - Out of the box'}, {value: 4, text: '4 - Configuration'}, {value: 3, text: '3 - Small Mod'},
                        {value: 2, text: '2 - Mod (>10d)'}, {value: 1, text: '1 - Third Party'}, {value: 0, text: '0 - Not Available'}]
            }
        }, {
            field: 'response_comment',
            title: 'Comment',
            sortable: true,
            filterControl: 'input',
            editable: {
                type: 'textarea'
            }
        }, {
            field: 'optimum_comment',
            title: 'Optimum',
            filterControl: 'input',
            editable: {
                type: 'textarea'
            }
        }, {
            field: 'update_required',
            title: 'Update Required',
            filterControl: 'input',
            visible: false,
            sortable: true,
            editable: {
                type: 'select',
                source: [{value: 1, text: 'Yes'}, {value: 0, text: 'No'}]
            }
        },{
            field: 'updated_value',
            title: 'Updated Response',
            filterControl: 'input',
            sortable: 'true',
            visible: false,
            editable: {
                type: 'select',
                source: [{value: 5, text: '5 - Out of the box'}, {value: 4, text: '4 - Configuration'}, {value: 3, text: '3 - Small Mod'},
                        {value: 2, text: '2 - Mod (>10d)'}, {value: 1, text: '1 - Third Party'}, {value: 0, text: '0 - Not Available'}]
            }
        }, {
            field: 'updated_response',
            title: 'Updated Comment',
            filterControl: 'input',
            visible: false,
            editable: {
                type: 'textarea'
            }
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/journey/journey_requirement',
            type: 'POST',
            data: {
                journey_id: row['journey_id'],
                requirement_id: row['id'],
                update_field: field,
                update_value: row[field]
            },
            success: function(data, status){
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

const keyFormatter = (value) => {
    if (value == 0) {
        return 'No';
    } else {
        return 'Yes';
    }
}

const moduleFormatter = (value, row) => {
    return `${row.module_name} | ${row.sub_module_name}`
}

const processFormatter = (value, row) => {
    return `${row.short_code} - ${row.process_name}`
}

const addVendors = function() {
    let href = location.href;
    let vendors = $('#vendors').val();
    $.ajax({
        url: '../../api/journey/add_vendor_requirements/' + href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            vendors: vendors
        },
        success: function(data, status){
            $('#table').bootstrapTable('refresh');
            $('.selectpicker').selectpicker('deselectAll');
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