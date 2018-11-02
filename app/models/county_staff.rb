class CountyStaff
    attr_reader :staff_id, :first_name, :last_name, :middle_initial, :country, :county_code, :privileges

    def initialize(staff_id: nil)
        @staff_id = staff_id
        @privileges = []
    end
end