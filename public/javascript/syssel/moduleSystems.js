$(function(){
    let href = location.href;
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/module_systems/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 700,
        columns: [{
            field: 'system_id',
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
            title: 'System',
            filterControl: 'input',
            sortable: true
        }]
    });
})

const systemDeleteFormatter = function(value, row){
    return '<a href="/syssel/delete_module/' + row.id + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
