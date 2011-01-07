class HomeController < ApplicationController
  def index

  end

  def reply
    render :json => create_form_hash
  end

  def post
    render :json => create_form_hash
  end

  private
  def create_form_hash
    form_hash = {}
    params.each do |k, v|
      unless ["controller", "action"].include? k
        v = CGI::escapeHTML v
        form_hash[k] = v.gsub /\n/, "<br>"
      end
    end
    form_hash["datetime"] = (Time.now.to_f * 1000).to_i
    # %e sometimes gives a leading space, need to trim
    form_hash["time"] = Time.now.strftime("%e %B %Y %R").strip
    form_hash
  end
end