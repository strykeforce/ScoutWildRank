/**
 * file:        2026-score-calculator.js
 * description: Page for estimating Reefscape match score.
 * author:      J. Scott
 * date:        2026-02-21
 */

/**
 * Represents the score keeping interface of a single alliance.
 */
class Alliance
{
    constructor(color)
    {
        this.color = color
        this.page = new WRPage(`${color} Alliance`)

        this.a_fuel = new WRCounter('Auto_Fuel')
        this.a_climb = new WRCounter('Auto_Climb')
        this.page.add_column(new WRColumn('Auto', [this.fuel, this.climb]))

        this.t_fuel = new WRCounter('Tele_Fuel')
        this.page.add_column(new WRColumn('Teleop', [this.t_fuel]))

        this.climbs = new WRMultiCounter('Climbs', ['L1', 'L2', 'L3'])
        this.page.add_column(new WRColumn('End Game', [this.climbs]))
    }

    get fuel_points()
    {
        return ( parseInt(this.a_fuel.counter.value_el.innerText) * 1 ) +
               ( parseInt(this.t_fuel.counter.value_el.innerText) * 1 )
    }

    get climb_points()
    {
        return parseInt(this.a_climb.counter.value_el.innerText) * 10 +
            parseInt(this.climbs.counters[0].value_el.innerText) * 10 +
            parseInt(this.climbs.counters[1].value_el.innerText) * 20 +
            parseInt(this.climbs.counters[2].value_el.innerText) * 30
    }

    get score()
    {
        return this.fuel_points + this.climb_points
    }

    get score_card()
    {
        let cell = document.createElement('th')
        cell.style.backgroundColor = this.color
        cell.style.color = 'white'
        cell.width = 175

        let name = document.createElement('div')
        name.innerText = this.color.toUpperCase()
        let score = document.createElement('h1')
        score.innerText = this.score

        cell.append(name, score)
        return cell
    }
}

var red, blue, score

/**
 * Runs on page load to initialize the page.
 */
function init_page()
{
    header_info.innerText = 'Score Calculator'

    blue = new Alliance('Blue')
    red = new Alliance('Red')
    let submit = new WRButton('Calculate', breakdown)
    score = document.createElement('span')
    console.log(submit)
    body.replaceChildren(blue.page, red.page, new WRPage('', [new WRColumn('', [submit, score])]))
}

/**
 * Adds a row to a given table to represent a component score.
 * @param {HTMLTableElement} table Table to add a row to.
 * @param {String} name Name of the scoring component.
 * @param {Number} blue Blue component score.
 * @param {Number} red Red component score.
 */
function add_score_row(table, name, blue, red)
{
    let row = table.insertRow()

    let blue_el = document.createElement('h2')
    blue_el.innerText = blue
    row.insertCell().append(blue_el)

    row.append(create_header(name))

    let red_el = document.createElement('h2')
    red_el.innerText = red
    row.insertCell().append(red_el)
}

/**
 * Builds a card containing a breakdown of the score, matching the on-screen breakdown.
 */
function breakdown()
{
    let table = document.createElement('table')
    table.style.textAlign = 'center'
    let row = table.insertRow()
    row.append(blue.score_card)
    row.insertCell()
    row.append(red.score_card)

    add_score_row(table, 'Climb', blue.climb_points, red.climb_points)
    add_score_row(table, 'Fuel', blue.fuel_points, red.fuel_points)

    let blue_win = blue.score > red.score
    let red_win = blue.score < red.score

    if (blue_win)
    {
        blue_rps.innerText += '🏆 🏆 🏆 '
    }
    else if (red_win)
    {
        red_rps.innerText += '🏆 🏆 🏆 '
    }
    else
    {
        blue_rps.innerText == '🏆 '
        red_rps.innerText == '🏆 '
    }

    if (blue.auto_rp)
    {
        blue_rps.innerText += '🤖 '
    }
    if (red.auto_rp)
    {
        red_rps.innerText += '🤖 '
    }

    if (blue.coral_rp(coop_bonus))
    {
        blue_rps.innerText += '🪸 '
    }
    if (red.coral_rp(coop_bonus))
    {
        red_rps.innerText += '🪸 '
    }

    if (blue.barge_rp)
    {
        blue_rps.innerText += '🛥️ '
    }
    if (red.barge_rp)
    {
        red_rps.innerText += '🛥️ '
    }

    score.replaceChildren(new WRCard(table, true))
}