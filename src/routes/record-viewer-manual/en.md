# Record Viewer Manual

Here is a brief manual for the CHUNI TOOLS Record Viewer. The tool is designed to help you view and analyze your CHUNITHM play records with detailed information and statistics.

![Record Viewer Manual](img/viewer-main.png)

## Record Viewer

### Play Records

Your play records are displayed in a table format, with 3 different tabs available (① in the above image):

- **BEST**: Displays your best scores for each song and difficulty.
- **CURRENT**: Shows the best 20 records for the latest version of CHUNITHM.
- **RECENT**: Displays your recent 50 records.

Each row (⑤ above) representing a single song & difficulty, contains the following information:

- The record's song title, difficulty, and score.
- **#**: Place of the record ranked by rating.
- **Const**: The chart constant for the corresponding song & difficulty. If the chart constant is still uncertain, there will be a small question mark icon next to it.
- **Rating**: The calculated rating of the record.
- **Rank**: The score rank of the record, if OVER POWER display is **disabled**.
- **OP** and **OP%**: The OVER POWER value or achievement percentage for the record, if OVER POWER display is enabled.
- **AJ**: The clear type of the record, which can be none, FC (Full Combo), or AJ (All Justice).
- **Plays**: The number of times the song has been played, if play count display is enabled. Due to technical limitations, you need to manually fetch the play count by:
    1. For each record, clicking on the play count cell.
    2. Batch fetching from the settings menu.

You can click on the table header (④ above) to **sort the records by the selected column**. The sorting order can be toggled between ascending and descending by clicking the header again.

### Player Stats

This section (③ above) displays your overall player statistics, including:

- Your player name, nameplates, and current rating.
- **Current B20**: Average rating for best 20 records in latest version.
- **Old B30**: Average rating for best 20 records in the previous version.
- **Play Count**: Total number of plays. (Only displays in BEST tab.)
- **Recent B30**: Average rating for best 30 records out of your last 50 plays. (Only displays in CURRENT and RECENT tabs.)
- **Rank/Clear Counts**: Distribution of your ranks/clears (AJ/FC) across all plays. Note that the displayed rank count accumulated, meaning it's calculated based on all records higher than the selected rank.

Optionally (when OVER POWER display is enabled), you can also see your total OVER POWER score and the current progress towards maximum OVER POWER. For detailed information on OVER POWER, please refer to [this unofficial guide](https://chunithm.org/intermediate/rating/#overpower-op) or [this document](https://wikiwiki.jp/chunithmwiki/レーティング・OVER%20POWER).

### Quick Actions

At the top of the page, you can find 3 quick action buttons (② above):

- <span class="material-icons !text-base">photo_camera_back</span> **Save B40 As Image**: Saves the current filtered best 40 records and player stats as an image file. For mobile users, you can choose to save the image to your device, copy to clipboard, or share it via other apps.
- <span class="material-icons !text-base">public</span> **Change Constant Version**: Toggles the chart constant version between the Japanese and International versions (if they're different).
- <span class="material-icons !text-base">settings</span> **Settings**: Opens the settings menu where you can enable/disable features like OVER POWER display, play count display, and more.

## Settings

![Settings Menu > Data](img/viewer-settings-data.png)

### Filtering Records

You can filter the records displayed in the table by **chart constant**, **difficulty**, **genre**, and **game version**. When filtering by difficulty, only the selected difficulties will be loaded, and the rest will be fetched on demand when you enable them in the settings menu.

### OVER POWER Display

You can configure the display of OVER POWER values/achievement percentages in the records table.

- If OVER POWER value is displayed, the max possible OP value will be displayed in smaller text.
- If OVER POWER display is disabled, the table will instead show the score rank for each record.

Normally, only played songs will be displayed in the table. But when OVER POWER display is enabled, the table will **show all songs** for accurate OVER POWER calculation, even if you haven't played them yet. Still, **some locked songs may not be displayed** due to technical limitations.

### Play Count Display

You can enable the display of play counts for each record.

If enabled, you can use the "Fetch Play Count" feature in the settings menu to retrieve several play counts at once. Enter the range of records to fetch in the 2 input fields then **click the "Fetch" button**, and the play counts will be fetched one by one. A progress popup will appear to show the fetching progress.
