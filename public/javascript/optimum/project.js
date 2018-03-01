$(function(){
    let href = location.href;
    let $table = $('#tasksTable').bootstrapTable({
        idField: 'id',
        url: '../../api/optimum/project_tasks/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'id',
            title: 'ID',
            visible: false
        },{
            field: 'task_name',
            title: 'Task',
            filterControl: 'input',
            formatter: taskNameFormatter
        }, {
            field: 'task_status',
            title: 'Status',
            halign: 'center',
            align: 'center',
            filterControl: 'input'
        }, {
            field: 'erp_id',
            title: 'ERP',
            halign: 'center',
            align: 'center',
        }]
    });
})

const taskNameFormatter = (value, row) => {
    return `<a href="/optimum/task/${row.id}">${value}</a>`
}

const addTask = function() {
    let href = location.href;
    let url = '../../api/optimum/add_project_task/' + href.substr(href.lastIndexOf('/') + 1)
    if ($('#task_name').val() == '') {
        $('#update_message').removeClass();
        $('#update_message').addClass("alert alert-danger text-center");
        $('#update_message').text('Task name cannot be blank');
        $('#update_message').delay(1000).fadeIn('normal', function(){
            $(this).delay(2500).fadeOut();
        })
        return;
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                task_name: $('#task_name').val()
            },
            success: function(data, status){
                $('#tasksTable').bootstrapTable('refresh');
                $('#task_name').val('');
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Added Task');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Error adding the Task');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        })
    }
}
