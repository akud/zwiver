class CreateEvents < ActiveRecord::Migration
  def up
    create_table :events do |t|
      t.string :url
      t.string :title
      t.text :description
      t.datetime :date
      t.string :venue
      t.string :address
      t.decimal :lat, :precision => 9, :scale => 7
      t.decimal :lon, :precision => 10, :scale => 7

      t.timestamps
    end
    add_index :events, [:url, :date], :unique => true
    add_index :events, :date
    #TODO: spatial index on lat, lon
  end

  def down
    drop_table :events
  end
end
