let vendor_status = [];
let vendor_reason = [];

const populateSelections = async function() {
    await $.ajax({
        url: '../../api/journey/vendor_status',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                vendor_status.push({value: data[i].id, text: data[i].status_name})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    await $.ajax({
        url: '../../api/journey/vendor_reason',
        type: 'GET',
        success: function(data, status) {
            for (i in data) {
                vendor_reason.push({value: data[i].id, text: data[i].reason_name})
            }
        },
        error: function(data, status) {
            console.log(status);
        }
    });
    return [vendor_status, vendor_reason];
}
const populateTable = async function(vendor_status, vendor_reason) {
    // console.log(vendor_status);
    // console.log(vendor_reason);
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_vendors/' + href.substr(href.lastIndexOf('/') + 1),
        idField: 'vendor_id',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'vendor_id',
            title: 'ID',
            visible: false
        },{
            field: 'vendor_name',
            title: 'Vendor',
            filterControl: 'input',
            formatter: vendorNameFormatter
        }, {
            field: 'vendor_solution_desc',
            title: 'Solution',
            filterControl: 'input',
            editable: {
                type: 'textarea'
            }
        },{
            field: 'status_id',
            title: 'Status',
            sortable: true,
            editable: {
                type: 'select',
                source: vendor_status
            }
        }, {
            field: 'reason_id',
            title: 'Reason',
            sortable: true,
            editable: {
                type: 'select',
                source: vendor_reason
            }
        },{
            field: 'status_comment',
            title: 'Comment',
            editable: {
                type: 'textarea'
            },
            visible: false
        }, {
            field: 'contact_name',
            title: 'Contact',
            editable: {
                type: 'text'
            }
        }, {
            field: 'include_in_report',
            title: 'Include',
            editable: {
                type: 'select',
                source: [{value: 'Yes', text: 'Yes'}, {value: 'No', text: 'No'}]
            },
            halign: 'center',
            align: 'center',
            filterControl: 'input'
        }]
    });
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/journey/journey_vendor',
            type: 'POST',
            data: {
                journey_id: row['journey_id'],
                vendor_id: row['vendor_id'],
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
    populateSelections()
        .then((response) => {
            // console.log(response);
            populateTable(vendor_status=response[0], vendor_reason=response[1]);
        })
})

const vendorNameFormatter = (value, row) => {
    return `<a href="/journey_vendor/${row.journey_id}/${row.vendor_id}">${value}</a>`
}

const contactFormatter = (value, row) => {
    if (row.contact_name && row.contact_email) {
        return `${row.contact_name || ''} &emsp;<a href="mailto:${row.contact_email}"><span class="glyphicon glyphicon-envelope"></span></a>`
    } else {
        return '';
    }

}

const addVendors = function() {
    let href = location.href;
    let vendors = $('#vendors').val();
    $.ajax({
        url: '../../api/journey/add_journey_vendors/' + href.substr(href.lastIndexOf('/') + 1),
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