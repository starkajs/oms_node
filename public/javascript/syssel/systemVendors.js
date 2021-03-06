$(function(){
    let href = location.href;
    let $table = $('#vendorsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/system_vendors/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'vendor_id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: vendorDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'vendor_name',
            title: 'Vendor',
            filterControl: 'input',
            sortable: true,
            formatter: vendorNameFormatter
        }]
    });
})

const vendorDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_system_vendors' +'/' + href.substr(href.lastIndexOf('/') + 1) + '/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
const vendorNameFormatter = function(value, row){
    return '<a href="/syssel/vendor/' + row.id + '">' + value + '</a>';
}

const addVendors = function() {
    let href = location.href;
    let vendors = $('#vendors').val();
    $.ajax({
        url: '../../api/syssel/add_system_vendors/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            vendors: vendors
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#vendorsTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added Vendor(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the vendor(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}