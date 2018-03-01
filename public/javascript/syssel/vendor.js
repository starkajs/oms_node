$(function(){
    let href = location.href;
    // Systems Table
    let $table = $('#systemsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/vendor_systems/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
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
            sortable: true,
            formatter: systemNameFormatter
        }]
    });
    // Industries Table
    $table = $('#industriesTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/vendor_industries/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'industry_id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: industryDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'classification_name',
            title: 'Industry',
            filterControl: 'input',
            sortable: true
        }]
    });
    // Locations Table
    $table = $('#locationsTable').bootstrapTable({
        idField: 'id',
        url: '../../api/syssel/vendor_locations/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        sortable: true,
        height: 400,
        columns: [{
            field: 'location_id',
            title: 'ID',
            visible: false
        }, {
            field: 'delete',
            title: 'Delete',
            formatter: locationDeleteFormatter,
            halign: 'center',
            align: 'center'
        },{
            field: 'location_description',
            title: 'Location',
            filterControl: 'input',
            sortable: true
        }]
    });
})

const systemDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_vendor_systems' +'/' + row.id + '/' + href.substr(href.lastIndexOf('/') + 1) + '"><span class="glyphicon glyphicon-trash"></span></a>';
}
const systemNameFormatter = function(value, row){
    return '<a href="/syssel/system/' + row.id + '">' + value + '</a>';
}

const industryDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_vendor_industries' +'/' + row.id + '/' + href.substr(href.lastIndexOf('/') + 1) + '"><span class="glyphicon glyphicon-trash"></span></a>';
}

const locationDeleteFormatter = function(value, row){
    let href = location.href;
    return '<a href="../../api/syssel/delete_vendor_locations' +'/' + row.location_id + '/' + href.substr(href.lastIndexOf('/') + 1) + '"><span class="glyphicon glyphicon-trash"></span></a>';
}

const addSystems = function() {
    let href = location.href;
    let systems = $('#systems').val();
    $.ajax({
        url: '../../api/syssel/add_vendor_systems/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            systems: systems
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#systemsTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added System(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the system(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}


const addIndustries = function() {
    let href = location.href;
    let industries = $('#industries').val();
    $.ajax({
        url: '../../api/syssel/add_vendor_industries/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            industries: industries
        },
        success: function(data, status){
            $('.selectpicker').selectpicker('deselectAll');
            $('#industriesTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added Industry(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the Industry(s)');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}


const addLocation = function() {
    let href = location.href;
    let country = $('#country').val();
    let region = $('#region').val();
    let city = $('#city').val();
    $.ajax({
        url: '../../api/syssel/add_vendor_location/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        data: {
            country: country,
            region: region,
            city: city
        },
        success: function(data, status){
            $('#locationsTable').bootstrapTable('refresh');
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Added Location');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the Location');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}


const populateSystemList = function() {
    let href = location.href;
    $('#populateSystems').text('Loading...');
    $.ajax({
        url: '../../api/syssel/vendor_systems_list/'+ href.substr(href.lastIndexOf('/') + 1),
        type: 'GET',
        success: function(data, status){
            let select = document.getElementById('systems');
            for (var i = 0 ; i < data.length; i++){
                var opt = data[i];
                var el = document.createElement("option");
                el.textContent = opt['system_name'];
                el.value = opt['id'];
                select.appendChild(el);
            }
            $('.selectpicker').selectpicker('refresh');
            $('#populateSystems').text('Complete');
            $('#populateSystems').removeClass('btn-danger');
            $('#populateSystems').addClass('btn-success');
        },
        error: function(data, status){
            $('#update_message').removeClass();
            $('#update_message').addClass("alert alert-success text-center");
            $('#update_message').text('Error adding the Location');
            $('#update_message').delay(1000).fadeIn('normal', function(){
                $(this).delay(2500).fadeOut();
            })
        }
    })
}