$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/optimum/clients',
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
            field: 'client_name',
            title: 'Client',
            filterControl: 'input',
            formatter: clientNameFormatter
        }, {
            field: 'url',
            title: 'Website',
            formatter: clientUrlFormatter,
            halign: 'center',
            align: 'center'
        }, {
            field: 'email',
            title: 'Email'
        },{
            field: 'erp_id',
            title: 'ERP',
            halign: 'center',
            align: 'center',
            visible: false
        },{
            field: 'crm_id',
            title: 'CRM',
            halign: 'center',
            align: 'center',
            visible: false
        },{
            field: 'project_count',
            title: 'Projects',
            halign: 'center',
            align: 'center'
        }]
    });
})

const clientNameFormatter = (value, row) => {
    return `<a href="/optimum/client/${row.id}">${value}</a>`
}

const clientUrlFormatter = function(value, row){
    if (value) {
        return '<a href="' + value + '" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a>';
    } else {
        return '';
    }
}