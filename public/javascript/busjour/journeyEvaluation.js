$(function(){
    $.fn.editable.defaults.mode = 'inline';
    let href = location.href;
    let $table = $('#evaluationTable').bootstrapTable({
        idField: 'id',
        url: '../../api/journey/journey_evaluation/' + href.substr(href.lastIndexOf('/') + 1),
        pagination: true,
        pageSize: '15',
        pageList: [5, 10, 20, 50, 'ALL'],
        showExport: true,
        filterControl: true,
        showColumns: true,
        height: 500,
        columns: [{
            field: 'category_id',
            title: 'ID',
            visible: false
        },{
            field: 'category_name',
            title: 'Category'
        }, {
            field: 'evaluation_weight',
            title: 'Weight',
            halign: 'center',
            align: 'center',
            editable: {
                type: 'text'
            }
        }]
    });
    getCurrentTotalWeight();
    $table.on('editable-save.bs.table', function(e, field, row, old, $el){
        $.ajax({
            url: '../../api/journey/evaluation_weight',
            type: 'POST',
            data: {
                journey_id: row['journey_id'],
                category_id: row['category_id'],
                update_field: field,
                update_value: row[field]
            },
            success: function(data, status){
                $('#evaluationTable').bootstrapTable('refresh');
                getCurrentTotalWeight();
                // $('#update_message').removeClass();
                // $('#update_message').addClass("alert alert-success text-center");
                // $('#update_message').text(data.message);
                // $('#update_message').delay(500).fadeIn('normal', function(){
                //     $(this).delay(2500).fadeOut();
                // })
            },
            error: function(data, status){
                $('#evaluationTable').bootstrapTable('refresh')
                getCurrentTotalWeight();
                $('#update_message').removeClass();
                $('#update_message').addClass("alert alert-danger text-center");
                $('#update_message').text(data.error);
                $('#update_message').delay(1000).fadeIn('normal', function(){
                    $(this).delay(2500).fadeOut();
                })
            }
        });
    });
})
const populateCategories = () => {
    let href = location.href;
    $.ajax({
        url: '../../api/journey/populate_evaluation/' + href.substr(href.lastIndexOf('/') + 1),
        type: 'POST',
        success: function(data, status) {
            console.log(data);
            $('#evaluationTable').bootstrapTable('refresh')
            getCurrentTotalWeight();
        },
        error: function(data, status) {
            console.log("error getting the weighting");
        }
    })
};
const getCurrentTotalWeight = () => {
    let href = location.href;
    $.ajax({
        url: '../../api/journey/journey_evaluation/' + href.substr(href.lastIndexOf('/') + 1),
        type: 'GET',
        success: function(data, status) {
            let total_weight = 0;
            for (d in data) {
                total_weight += data[d]['evaluation_weight'];
            }
            if (total_weight != 100) {
                $('#current_weight').removeClass()
                    .addClass('text-danger')
                    .text(`The current total weight does not equal 100%: ${total_weight}%`)
            } else {
                $('#current_weight').removeClass().text('');
            }
        },
        error: function(data, status) {
            console.log("error getting the weighting");
        }
    })
};