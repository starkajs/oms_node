$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/entarch/requirements',
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
            field: 'business_capability',
            title: 'Capability',
            filterControl: 'input'
        }, {
            field: 'process',
            title: 'Process',
            filterControl: 'input'
        }, {
            field: 'industry_group',
            title: 'Industry',
            filterControl: 'input'
        },{
            field: 'module',
            title: 'Module',
            filterControl: 'input'
        },{
            field: 'requirement',
            title: 'Requirement',
            formatter: requirementFormatter,
            filterControl: 'input'
        },{
            field: 'example',
            title: 'Example',
            filterControl: 'input'
        },{
            field: 'is_valid',
            title: 'Valid',
            filterControl: 'input',
            halign: 'center',
            align: 'center',
            formatter: validFormatter
        }]
    });
})

const requirementFormatter = (value, row) => {
    return `<a href="/entarch/requirement/${row.id}">${value}</a>`
}

const validFormatter = (value) => {
    if (value == 1) {
        return 'Yes';
    } else {
        return 'No';
    }
}
