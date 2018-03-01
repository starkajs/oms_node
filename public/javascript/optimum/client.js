$(function(){
    let href = location.href;
    let $table = $('#projectsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/optimum/client_projects/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'project_name',
            title: 'Project',
            filterControl: 'input',
            formatter: projectNameFormatter
        }, {
            field: 'project_status',
            title: 'Status',
            halign: 'center',
            align: 'center',
            filterControl: 'input'
        }, {
            field: 'erp_id',
            title: 'ERP',
            halign: 'center',
            align: 'center',
        }, {
            field: 'crm_id',
            title: 'CRM',
            halign: 'center',
            align: 'center',
        }]
    });
    $table = $('#journeysTable').bootstrapTable({
        idField: 'id',
        url: '../../api/optimum/client_journeys/' + href.substr(href.lastIndexOf('/') + 1),
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
            field: 'journey_name',
            title: 'Journey',
            filterControl: 'input',
            formatter: journeyNameFormatter
        }]
    });
})

const projectNameFormatter = (value, row) => {
    return `<a href="/optimum/project/${row.id}">${value}</a>`
}

const journeyNameFormatter = (value, row) => {
    return `<a href="/optimum/journey/${row.id}">${value}</a>`
}

const addJourney = function() {
    let href = location.href;
    let url = '../../api/optimum/add_client_journey/' + href.substr(href.lastIndexOf('/') + 1)
    if ($('#journey_name').val() == '') {
        $('#update_message').removeClass();
        $('#update_message').addClass("alert alert-danger text-center");
        $('#update_message').text('Journey name cannot be blank');
        $('#update_message').delay(1000).fadeIn('normal', function(){
            $(this).delay(2500).fadeOut();
        })
        return;
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                journey_name: $('#journey_name').val()
            },
            success: function(data, status){
                $('#journeysTable').bootstrapTable('refresh');
                $('#journey_name').val('');
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Added Journey');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Error adding the Journey');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        })
    }
}


const addProject = function() {
    let href = location.href;
    let url = '../../api/optimum/add_client_project/' + href.substr(href.lastIndexOf('/') + 1)
    if ($('#project_name').val() == '') {
        $('#update_message').removeClass();
        $('#update_message').addClass("alert alert-danger text-center");
        $('#update_message').text('Project name cannot be blank');
        $('#update_message').delay(1000).fadeIn('normal', function(){
            $(this).delay(2500).fadeOut();
        })
        return;
    } else {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                project_name: $('#project_name').val()
            },
            success: function(data, status){
                $('#project_name').val('');
                $('#projectsTable').bootstrapTable('refresh');
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Added Project');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            },
            error: function(data, status){
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-success text-center");
                $('#update_message').text('Error adding the Project');
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        })
    }
}