$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/vendors',
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        filterControl: true,
        showExport: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'id',
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
            title: 'Name',
            formatter: vendorNameFormatter,
            filterControl: 'input',
            sortable: true
        }, {
            field: 'company_profile',
            title: 'Description',
            visible: false
        }, {
            field: 'vendor_url',
            title: 'Website',
            halign: 'center',
            align: 'center',
            formatter: vendorUrlFormatter
        }, {
            field: 'contact_name',
            title: 'Contact',
            formatter: vendorContactFormatter
        }, {
            field: 'is_uk_based',
            title: 'UK Base',
            halign: 'center',
            align: 'center',
            filterControl: 'input'
        },{
            field: 'is_eu_based',
            title: 'EU Base',
            halign: 'center',
            align: 'center',
            filterControl: 'input'
        },{
            field: 'support_locations',
            title: 'Support Locations',
            filterControl: 'input'
        },{
            field: 'system_count',
            title: 'Systems',
            halign: 'center',
            align: 'center',
            filterControl: 'input',
            sortable: true
        }]
    });
})


const vendorNameFormatter = function(value, row){
    return '<a href="/syssel/vendor/' + row.id + '">' + value + '</a>';
};

const vendorDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_vendor/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
};

const vendorUrlFormatter = function(value, row){
    if (value) {
        return '<a href="' + value + '" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>';
    } else {
        return '';
    }
}

const vendorContactFormatter = function(value, row){
    if (value && row.contact_email) {
        return `${value} <a href="mailto:${row.contact_email}">&emsp;<span class="glyphicon glyphicon-envelope"></span></a>`;
    } else {
        return '';
    }
}

const applySystemFilter = function(){
    let search = `%${$('#systemFilter').val()}%`
    $.ajax({
        url: '../../api/syssel/vendors_systems',
        type: 'POST',
        data: {
            search: search
        },
        success: function(data, status){
            $('#table').bootstrapTable('load', data);
            $('#pageTitle').text(`Vendors: filter of "${$('#systemFilter').val()}" applied`);
            $('#systemFilter').val('');

        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error applying the filter');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}


