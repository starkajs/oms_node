$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/syssel/systems',
        pagination: true,
        pageSize: '15',
        sidePagination: 'server',
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
            formatter: systemDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'system_name',
            title: 'Name',
            formatter: systemNameFormatter,
            filterControl: 'input'
        }, {
            field: 'system_description',
            title: 'Description'
        }, {
            field: 'system_url',
            title: 'Website',
            halign: 'center',
            align: 'center',
            formatter: systemUrlFormatter
        }, {
            field: 'vendor_count',
            title: 'Vendors',
            halign: 'center',
            align: 'center'
        }]
    });
})


const systemNameFormatter = function(value, row){
    return '<a href="/syssel/system/' + row.id + '">' + value + '</a>';
};

const systemDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_system/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
};

const systemUrlFormatter = function(value, row){
    if (value) {
        return '<a href="' + value + '" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>';
    } else {
        return '';
    }
}

