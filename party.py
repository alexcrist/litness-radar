"""Class for litness-radar party."""
from __future__ import print_function
from datetime import datetime


class Party:
    """Class for hosting a party."""

    standard_drink = 1
    bac_per_sd = 0.027
    individual_hourly_bac_decrease = 0.00755

    def __init__(self, num_people=0):
        """Start a party."""
        self.num_people = num_people
        self.group_BAC = 0.0
        self.last_update_time = datetime.now()

    def check_in(self):
        """Check in a new person."""
        self.num_people += 1

    def check_out(self):
        """Check someone out."""
        if self.num_people > 0:
            self.num_people -= 1

    def drink(self, num_drinks=standard_drink):
        """Drink! And update the group BAC level.

        Args:
            num_drinks (int): The number of standard drinks drank.
                              Where one standard drink is a beer at
                              4.5% or one shot of 40% alcohol.
        """
        individual_bac_increase = num_drinks * self.bac_per_sd
        group_bac_increase = individual_bac_increase / self.num_people
        self.group_BAC += group_bac_increase

    def update(self):
        """Update the group BAC by decrease since last update."""
        new_time = datetime.now()
        time_dif = new_time - self.last_update_time
        hour_dif = time_dif.total_seconds() / 60. / 60.

        self.last_update_time = new_time

        bac_decrease = (hour_dif / self.num_people
                        * self.individual_hourly_bac_decrease)
        self.group_BAC -= bac_decrease
        return self.group_BAC

    def print_bac(self):
        """Print the group BAC to 12 decimal places."""
        print('Group BAC: {0:.12f}'.format(self.group_BAC))
