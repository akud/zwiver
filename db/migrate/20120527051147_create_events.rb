class CreateEvents < ActiveRecord::Migration
  def up
    create_table :events do |t|
      t.string :url
      t.string :title
      t.text :description
      t.datetime :date
      t.string :location

      t.timestamps
    end
    add_index :events, [:url, :title], :unique => true
    add_index :events, :date
  end

  def down
    drop_table :events
  end
end
