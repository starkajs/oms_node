$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/optimum/projects',
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
            field: 'project_name',
            title: 'Project',
            filterControl: 'input',
            formatter: projectNameFormatter
        }, {
            field: 'project_type_name',
            title: 'Project Type',
            filterControl: 'input'
        }, {
            field: 'project_area_name',
            title: 'Project Area',
            filterControl: 'input'
        }, {
            field: 'project_status',
            title: 'Status',
            filterControl: 'input'
        }, {
            field: 'erp_id',
            title: 'ERP'
        },{
            field: 'is_internal_project',
            title: 'Internal',
            filterControl: 'input',
            formatter: internalProjectFormatter
        }, {
            field: 'task_count',
            title: 'Tasks',
            halign: 'center',
            align: 'center'
        }]
    });
})

const clientNameFormatter = (value, row) => {
    return `<a href="/optimum/client/${row.client_id}">${value}</a>`
}

const projectNameFormatter = (value, row) => {
    return `<a href="/optimum/project/${row.id}">${value}</a>`
}

const internalProjectFormatter = (value) => {
    if (value === 0) {
        return 'Client Project';
    } else {
        return 'Internal Project';
    }
}