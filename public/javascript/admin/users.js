$(function(){
    let $table = $('#table').bootstrapTable({
        idField: 'id',
        url: '../api/admin/users',
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
        }, {
            field: 'full_name',
            title: 'Name',
            filterControl: 'input',
            formatter: userNameFormatter
        }, {
            field: 'email',
            title: 'Email',
            filterControl: 'input'
        }, {
            field: 'role_name',
            title: 'Role',
            filterControl: 'input'
        }, {
            field: 'is_active',
            title: 'Active',
            filterControl: 'input',
            formatter: isActiveFormatter
        }, {
            field: 'last_login',
            title: 'Last Login'
        }]
    });
})


const userNameFormatter = function(value, row){
    return '<a href="/admin/user/' + row.id + '">' + value + '</a>';
};
const isActiveFormatter = function(value){
    if (value == 0) {
        return 'No';
    } else {
        return 'Yes';
    }
};