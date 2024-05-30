use std::fmt::{Debug, Formatter};
use std::fs;
use std::time::Instant;
use crate::Direction::{North, East, South, West};
use crate::MapSquare::{EmptySpace, MoveableRock, StationaryRock};

#[derive(Clone, PartialEq)]
enum MapSquare {
    MoveableRock,
    StationaryRock,
    EmptySpace,
}

#[derive(PartialEq)]
enum Direction {
    North,
    West,
    South,
    East,
}

type Map = Vec<Vec<MapSquare>>;

impl MapSquare {
    fn from(character: char) -> Result<MapSquare, String> {
        match character {
            'O' => Ok(MoveableRock),
            '#' => Ok(StationaryRock),
            '.' => Ok(EmptySpace),
            a => Err(format!("'{a}' is not a valid character"))
        }
    }
}

impl Debug for MapSquare {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", match self {
            MoveableRock => '0',
            StationaryRock => '#',
            EmptySpace => '.'
        })
    }
}

fn main() {
    let input = fs::read_to_string("input.txt").unwrap();
    part_one(&input);
    part_two(&input);
}

fn part_one(input: &str) {
    let start = Instant::now();
    let map = build_map(input);
    println!("part one: {} - {:?}", calculate_load(&tilt(&map, &North)), start.elapsed());
}

fn part_two(input: &str) {
    let start = Instant::now();
    let mut map = build_map(input);
    
    for _ in 0..1_000_000_000 {
        for dir in [North, West, South, East] {
            map = tilt(&map, &dir);
        }
    }
    
    println!("part two: {} - {:?}", calculate_load(&map), start.elapsed());
}

fn build_map(input: &str) -> Map {
    input.lines()
        .map(|line| {
            line.chars()
                .map(|char| MapSquare::from(char).unwrap())
                .collect::<Vec<MapSquare>>()
        })
        .collect::<Map>()
}

fn tilt(map: &Map, direction: &Direction) -> Map {
    let mut result = map.clone();
    
    if *direction == North || *direction == West {
        for (line_index, line) in map.iter().enumerate() {
            for (row_index, square) in line.iter().enumerate() {
                if let MoveableRock = square {
                    push_direction(&mut result, direction, (line_index, row_index));
                }
            }
        }
    } else {
        for (line_index, line) in map.iter().enumerate().rev() {
            for (row_index, square) in line.iter().enumerate().rev() {
                if let MoveableRock = square {
                    push_direction(&mut result, direction, (line_index, row_index));
                }
            }
        }
    }
    

    result
}

fn push_direction(map: &mut Map, direction: &Direction, coordinates: (usize, usize)) {
    let new_location = check_direction(map, direction, coordinates);
    if new_location != coordinates {
        map[coordinates.0][coordinates.1] = EmptySpace;
        map[new_location.0][new_location.1] = MoveableRock;
    }
}

fn check_direction(map: &Map, direction: &Direction, location: (usize, usize)) -> (usize, usize) {
    if has_reached_limit(map, direction, location) {
        return location
    }
    
    let new_coordinates = get_new_coordinates(direction, location);
    
    if map[new_coordinates.0][new_coordinates.1] == EmptySpace {
        check_direction(map, direction, new_coordinates)
    } else {
        location
    }
}

fn has_reached_limit(map: &Map, direction: &Direction, location: (usize, usize)) -> bool {
    let limit = get_limit(map, direction);
    match direction {
        East | West => location.1 == limit,
        North | South => location.0 == limit,
    }
}

fn get_limit(map: &Map, direction: &Direction) -> usize { 
    match direction {
        North | West => 0,
        East => map[0].len() -1,
        South => map.len() - 1,
    }
}

fn get_new_coordinates(direction: &Direction, location: (usize, usize)) -> (usize, usize){
    match direction {
        North => (location.0 - 1, location.1),
        East => (location.0, location.1 + 1),
        South => (location.0 + 1, location.1),
        West => (location.0, location.1 - 1),
    }
}

fn calculate_load(map: &Map) -> usize {
    let mut row_modifier = map.len();

    map.iter().map(|line| {
        let value: usize = line.iter().map(|square| {
            if *square == MoveableRock { row_modifier } else { 0 }
        }).sum();
        row_modifier -= 1;
        value
    }).sum()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn tilt_north_test() {
        let input = "O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....";

        let map = build_map(input);

        assert_eq!(build_map("OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#...."), tilt(&map, &North));
    }

    #[test]
    fn pattern_test() {
        let input = "O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....";

        let mut map = build_map(input);
        let mut map_history = vec!(map.clone());

        for i in 0..100 {
            for direction in [North, West, South, East] {
                map = tilt(&map, &direction);
            }
            let new_map = map.clone();
            map_history.push(new_map);

             if map_history.iter().any(|history| *history == map){
                 println!("{i}");
                 map.iter().for_each(|line|println!("{line:?}"));
                 break;
             }
        }
    }

    #[test]
    fn sum_tension_test() {
        let input = "O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....";

        let map = build_map(input);
        assert_eq!(136, calculate_load(&tilt(&map, &North)));
    }

    #[test]
    fn cycles_test() {
        let input = "O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....";

        let mut map = build_map(input);

        for direction in [North, West, South, East] {
            map = tilt(&map, &direction);
        }

        assert_eq!(build_map(".....#....
....#...O#
...OO##...
.OO#......
.....OOO#.
.O#...O#.#
....O#....
......OOOO
#...O###..
#..OO#...."), map);

        for direction in [North, West, South, East] {
            map = tilt(&map, &direction);
        }

        assert_eq!(build_map(".....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#..OO###..
#.OOO#...O"), map);

        for direction in [North, West, South, East] {
            map = tilt(&map, &direction);
        }

        assert_eq!(build_map(".....#....
....#...O#
.....##...
..O#......
.....OOO#.
.O#...O#.#
....O#...O
.......OOO
#...O###.O
#.OOO#...O"), map);

    }
}



