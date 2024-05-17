/**
 * @author: danb@nebulaconsulting.co.uk
 * @date: 16/05/2024
 * @description: https://adventofcode.com/2023/day/14
 */

public with sharing class Dish {

    private static final String ROUNDED_ROCK = 'O'; // 79
    private static final String CUBE_ROCK = '#'; // 35
    private static final String EMPTY_SPACE = '.'; // 46

    private List<List<String>> platform = new List<List<String>>();

    public Dish(String platformText) {

        // Move platform text into 2D representation of the platform
        for (String platformLine : platformText.split('\n')) {

            List<String> platformLineArray = new List<String>();

            for (Integer i = 0; i < platformLine.length(); i++) {
                platformLineArray.add(platformLine.mid(i,1));
            }

            platform.add(platformLineArray);
        }

    }

    public Integer calculate() {

        Integer totalLoad = 0;

        for (Integer columnIndex = 0; columnIndex < platform[0].size(); columnIndex++) {
            Integer verticalSpacesCount = 0;

            for (Integer rowIndex = 0; rowIndex < platform.size(); rowIndex++) {
                Integer load = platform.size() - rowIndex;
                String theChar = platform[rowIndex][columnIndex];

                if (theChar == EMPTY_SPACE) {
                    verticalSpacesCount++;
                    continue;
                } else if (theChar == CUBE_ROCK) {
                    verticalSpacesCount = 0;
                    continue;
                }

                Assert.areEqual(theChar, ROUNDED_ROCK);

                // ROUNDED_ROCK - Move the rounded rock up the number of available spaces
                if (verticalSpacesCount > 0) {
                    load += verticalSpacesCount; // calculate based on new position, not current row
                    platform[rowIndex][columnIndex] = EMPTY_SPACE;
                    platform[rowIndex - verticalSpacesCount][columnIndex] = theChar; // this will always be rounded rock here
                }

                totalLoad += load;
            }
        }

        return totalLoad;
    }

}