/**
 * The control panel.
 */
var Panel = {
    init: function() {
        var $algo = $('#algorithm_panel');

        $('.panel').draggable();
        $('.accordion').accordion({
            collapsible: false,
        });
        $('.option_label').click(function() {
            $(this).prev().click();
        });
        $('#hide_instructions').click(function() {
            $('#instructions_panel').slideUp();
        });
        $('#play_panel').css({
            top: $algo.offset().top + $algo.outerHeight() + 20
        });
        $('#button2').attr('disabled', 'disabled');
    },
    /**
     * Get the user selected path-finder.
     * TODO: clean up this messy code.
     */
    getFinder: function() {
        var finder, selected_header, heuristic, biDirectional, weight, trackJumpRecursion;

        selected_header = $(
            '#algorithm_panel ' +
            '.ui-accordion-header[aria-selected=true]'
        ).attr('id');

        switch (selected_header) {

        case 'astar_header':
            biDirectional = typeof $('#astar_section ' +
                                     '.bi-directional:checked').val() !=='undefined';

            /* parseInt returns NaN (which is falsy) if the string can't be parsed */
            weight = parseInt($('#astar_section .spinner').val()) || 1;
            weight = weight >= 1 ? weight : 1; /* if negative or 0, use 1 */

            heuristic = $('input[name=astar_heuristic]:checked').val();
            if (biDirectional) {
                finder = new PF.BiAStarFinder({
                    heuristic: PF.Heuristic[heuristic],
                    weight: weight
                });
            } else {
                finder = new PF.AStarFinder({
                    heuristic: PF.Heuristic[heuristic],
                    weight: weight
                });
            }
            break;

        case 'breadthfirst_header':
            biDirectional = typeof $('#breadthfirst_section ' +
                                     '.bi-directional:checked').val() !== 'undefined';
            if (biDirectional) {
                finder = new PF.BiBreadthFirstFinder({
                });
            } else {
                finder = new PF.BreadthFirstFinder({
                });
            }
            break;

        case 'bestfirst_header':
            biDirectional = typeof $('#bestfirst_section ' +
                                     '.bi-directional:checked').val() !== 'undefined';
            heuristic = $('input[name=bestfirst_heuristic]:checked').val();
            if (biDirectional) {
                finder = new PF.BiBestFirstFinder({
                    heuristic: PF.Heuristic[heuristic]
                });
            } else {
                finder = new PF.BestFirstFinder({
                    heuristic: PF.Heuristic[heuristic]
                });
            }
            break;

        case 'dijkstra_header':
            biDirectional = typeof $('#dijkstra_section ' +
                                     '.bi-directional:checked').val() !=='undefined';
            if (biDirectional) {
                finder = new PF.BiDijkstraFinder({
                });
            } else {
                finder = new PF.DijkstraFinder({
                });
            }
            break;

        }

        return finder;
    }
};
