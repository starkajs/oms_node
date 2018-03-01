$(function(){
    let href = location.href;
    let $table = $('#projectsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_projects/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 350,
        columns: [{
            field: 'project_id',
            title: 'ID',
            visible: false
        },{
            field: 'project_name',
            title: 'Project',
            filterControl: 'input',
            formatter: projectNameFormatter
        }]
    });
})

const projectNameFormatter = (value, row) => {
    return `<a href="/optimum/project/${row.project_id}">${value}</a>`
}

const addProjects = function() {
    let href = location.href;
    let url = '../../api/journey/add_journey_project/' + href.substr(href.lastIndexOf('/') + 1)
    if ($('#projects').val() == '') {
        $('#update_message').removeClass();
        $('#update_message').addClass("alert alert-danger text-center");
        $('#update_message').text('Select a project');
        $('#update_message').delay(1000).fadeIn('normal', function(){
            $(this).delay(2500).fadeOut();
        })
        return;
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                project: $('#projects').val()
            },
            success: function(data, status){
                $('#projectsTable').bootstrapTable('refresh');
                $('.selectpicker').selectpicker('deselectAll');
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Added project');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Error adding the project');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        })
    }
}