const populateTable = async function() {
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_vendors_score/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'status_name',
            title: 'Status',
            filterControl: 'input'
        },{
            field: 'quality_time_score',
            title: 'Timeliness',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'quality_response_score',
            title: 'Quality',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'finance_score',
            title: 'Finance',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'delivery_score',
            title: 'Delivery',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'risk_score',
            title: 'Risk',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'support_score',
            title: 'Support',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        },{
            field: 'costing_score',
            title: 'Costing',
            sortable: true,
            halign: 'center',
            align: 'center',
            editable: {
                type: 'select',
                source: [{value: 1, text: '1'}, {value: 2, text: '2'}, {value: 3, text: '3'}, {value: 4, text: '4'}, {value: 5, text: '5'},
                        {value: 6, text: '6'}, {value: 7, text: '7'}, {value: 8, text: '8'}, {value: 9, text: '9'}, {value: 10, text: '10'}]
            }
        }, {
            field: 'requirement_fit',
            title: 'Fit [%]',
            sortable: true,
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            formatter: percentageFormatter
        }, {
            field: 'implementation_cost',
            title: 'Implem. £',
            sortable: true,
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            formatter: numberFormatter
        }, {
            field: 'annual_software_cost',
            title: 'Annual £',
            sortable: true,
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            formatter: numberFormatter
        },{
            field: 'one_off_software_cost',
            title: 'One Off £',
            sortable: true,
            editable: {
                type: 'text'
            },
            halign: 'center',
            align: 'center',
            formatter: numberFormatter
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
    populateTable();
})

const vendorNameFormatter = (value, row) => {
    return `<a href="/journey_vendor/${row.journey_id}/${row.vendor_id}">${value}</a>`
}

const numberFormatter = (value) => {
    let number = numeral(value).format('0,0');
    return number;
}

const percentageFormatter = (value) => {
    let number = numeral(value).format('0.00%');
    return number;
}