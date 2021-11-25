$(document).ready(function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    /*  className colors

    className: default(transparent), important(red), chill(pink), success(green), info(blue)

    */


    /* initialize the external events
    -----------------------------------------------------------------*/

    $('#external-events div.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });
    let allEvents = []
     $.ajax({
                url: '/add_event/',
                method: 'GET',
                success : function(response){

                    for (event of response.data){
                        eventDataObject = {
                            allDay: false,
                            className: 'important'
                        }
                        eventDataObject['title'] = event['event_title']
                        start = new Date(event['start_date'].replace('Z',''))
                        eventDataObject['start'] = start
                        current = new Date()
                        eventDataObject['end'] = new Date(event['end_date'].replace('Z',''))
                         if ( (start.getDate() === current.getDate()) && (start.getMonth() === current.getMonth()) && (start.getYear() === current.getYear())){
                             eventDataObject['className'] = 'success';
                        }
                        eventDataObject['id'] = event['event_id']
                        allEvents.push(eventDataObject)
                    }
                    getCalender(allEvents)
                },
                error: function(){
                    alert('Failed to add the event')
                    allEvents([])
                }
            })

    $('#delete_event').click(function(){
        event_id = $('#event_id').val();
        if (!event_id){
            alert('Event does not exists');
            return false;
        }
        $.ajax({
            url: '/delete_event/',
            method: 'POST',
            data: {'event_id': event_id},
            success: function(){
                window.location.href = '/market_summary/';
            },
            error: function(err){
                alert('Failed to delete the event')
            }
        })
    })
    /* initialize the calendar
    -----------------------------------------------------------------*/



});

function getCalender(allEvents){
    $('#calendar').fullCalendar( 'changeView', 'agendaDay');
    var calendar =  $('#calendar').fullCalendar({
        header: {
            left: 'title',
            center: 'agendaDay,agendaWeek,month',
            right: 'prev,next today'
        },
        events: '/add_event/',
        editable: true,
        firstDay: 1, //  1(Monday) this can be changed to 0(Sunday) for the USA system
        selectable: true,
        selectHelper: true,
        defaultView: 'agendaDay',

        axisFormat: 'h:mm',
        columnFormat: {
            month: 'ddd',    // Mon
            week: 'ddd d', // Mon 7
            day: 'dddd M/d',  // Monday 9/7
            agendaDay: 'dddd d'
        },
        titleFormat: {
            month: 'MMMM yyyy', // September 2009
            week: "MMMM yyyy", // September 2009
            day: 'MMMM yyyy'                  // Tuesday, Sep 8, 2009
        },
        allDaySlot: false,
        selectHelper: true,

        select: function(start, end, allDay) {
            let user_type = $('#user_type').val()
            if (user_type != 'Admin'){
                return false;
            }
            if (start.getDate() < new Date().getDate() && start.getMonth() <= new Date().getMonth()){
                alert('Past date entry is not allowed');
                return false;
            }
            var eventsCount = 0;
            var date = moment(start).format("YYYY-MM-DD");
            $('#calendar').fullCalendar('clientEvents', function(event) {
                var start = moment(event.start).format("YYYY-MM-DD");
                var end = moment(event.end).format("YYYY-MM-DD");
                if(date == start)
                {
                    eventsCount++;
                }
            });
            if (eventsCount > 2)
            {
                alert('You cannot add more than 3 events')
                return false;
            }
            var title = prompt('Event Title:');
             if (title) {
                calendar.fullCalendar('renderEvent',
                    {
                        title: title,
                        start: start,
                        end: end,
                        allDay: allDay
                    },
                    true // make the event "stick"
                );
                calendar.fullCalendar('unselect');
                $.ajax({
                url: '/add_event/',
                method: 'POST',
                data: {'title': title, 'start': start, 'end': end},
                success : function(response){

                    allEvents = []
                    alert('Event Added Successfully')
                    for (event of response.data){
                        eventObject = {
                            allDay: false,
                            className: 'important'
                        }
                        eventObject['title'] = event['event_title']
                        start = new Date(event['start_date'].replace('Z',''))
                        eventObject['start'] = start
                        current = new Date()
                        if ( (start.getDate() === current.getDate()) && (start.getMonth() === current.getMonth()) && (start.getYear() === current.getYear())){
                             eventObject['className'] = 'success';
                        }
                        eventObject['end'] = new Date(event['end_date'].replace('Z',''))
                        eventObject['id'] = event['event_id']
                        allEvents.push(eventObject)
                    }
                    $('#calendar').fullCalendar('removeEvents')
                    $('#calendar').fullCalendar('addEventSource', allEvents);
                    $('#calendar').fullCalendar('rerenderEvents' );
                },
                error: function(){
                    alert('Failed to add the event')
                }
            })
            }



        },
        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function(date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        },
        events: allEvents,
        eventClick: function(event){
            let event_id = event.id
            let user_type = $('#user_type').val()
            $('#event_id').val(event_id)
            if (event_id){
                $.ajax({
                    url: '/get_stocks_detail/',
                    method: 'POST',
                    data: {'event_id': event_id},
                    success: function(response){
                       data = response.data
                       if(Object.keys(data).length > 0){
                         console.log(data)
                         if($('#user_type').val() == 'Admin'){
                            $('#script_name').val(data['script_name'])
                               $('#target_price').val(data['target_price'])
                               $('#stop_loss').val(data['stop_loss'])
                               $('#holding_period').val(data['holding_period'])
                         }
                         else{
                               $('#script_name_user').text(data['script_name'])
                               $('#target_price_user').text(data['target_price'])
                               $('#stop_loss_user').text(data['stop_loss'])
                               $('#holding_period_user').text(data['holding_period'])
                         }
                       }
                       else{
                            if($('#user_type').val() == 'Admin'){
                                $('#script_name').val('00')
                                $('#target_price').val('00')
                                $('#stop_loss').val('00')
                                $('#holding_period').val('00')
                            }
                            else{
                                   $('#script_name_user').text('00')
                                   $('#target_price_user').text('00')
                                   $('#stop_loss_user').text('00')
                                   $('#holding_period_user').text('00')
                            }
                       }
                       $('#modal').find('a')[0].click();
                    },
                    error: function(error){
                        console.log(error)
                    }
                })
            }
        },
//        editable: true,
//        eventResize: function(event){
//            let start  = moment(event.start).format("YYYY-MM-DD HH:mm:ss");
//            let end = moment(event.end).format("YYYY-MM-DD HH:mm:ss");
//            let title = event.title
//            let id = event._id
//            $.ajax({
//                url: '/handle_time_data/',
//                method: 'POST',
//                data: {'start': start, 'end': end, 'event_id': event_id},
//                success: function(){
//                    calendar.fullCalendar('refetchEvents');
//                },
//                error: function(err){
//                    console.log(err)
//                }
//            })
//        },

//        events: [
//            {
//                title: 'Stock Name 1',
//                start: new Date(y, m, 1),
//                className: 'success'
//            },
//            {
//                id: 999,
//                title: 'Stock Name 2',
//                start: new Date(y, m, d-3, 16, 0),
//                allDay: false,
//                className: 'important'
//            },
//            {
//                id: 999,
//                title: 'Stock Name 3',
//                start: new Date(y, m, d+4, 16, 0),
//                allDay: false,
//                className: 'important'
//            },
//            {
//                title: 'Stock Name 4',
//                start: new Date(y, m, d, 10, 30),
//                allDay: false,
//                className: 'important'
//            },
//            {
//                title: 'Stock Name 5',
//                start: new Date(y, m, d, 12, 0),
//                end: new Date(y, m, d, 14, 0),
//                allDay: false,
//                className: 'important'
//            },
//            {
//                title: 'Stock Name 6',
//                start: new Date(y, m, d+1, 19, 0),
//                end: new Date(y, m, d+1, 22, 30),
//                allDay: false,
//            },
//            {
//                title: 'Stock Name 7',
//                start: new Date(y, m, 28),
//                end: new Date(y, m, 28),
//               className: 'success'
//            }
//        ],
    });
}